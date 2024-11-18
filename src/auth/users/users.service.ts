import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRoles } from 'src/entities/base-role.entity';
import { UserRoles } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfile } from 'src/entities/user-profile.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepo: Repository<UserRoles>,
    @InjectRepository(BaseRoles)
    private readonly baseRolesRepo: Repository<BaseRoles>,
    private readonly configService: ConfigService,
    private entityManager: EntityManager
  ) {}
  async getUser(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid Credentials');
    }
    const users = await this.userRepo.findOne({
      where: { id: id },
    });
    if (!users) {
      throw new BadRequestException('Invalid Credentials');
    }
    return users;
  }

  async getUserRole(userId: number) {
    return await this.userRolesRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: { baseRoles: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const getUsername = await this.userRepo.findOne({
      where: { username: createUserDto.username },
    });
    if (getUsername) {
      throw new BadRequestException('ผู้ใช้งานซ้ำ');
    }
    const passwordSalt = await bcrypt.genSalt(
      parseInt(this.configService.get<number>('APP_BCRYPT_ITER', { infer: true }))
    );

    const passwordHash = await bcrypt.hash(createUserDto.password, passwordSalt);
    const passwordIter = bcrypt.getRounds(passwordHash);

    const newUser = new User({
      username: createUserDto.username,
      passwordHash: passwordHash,
      passwordIter: passwordIter,
      passwordSalt: passwordSalt,
    });

    const userId = await this.entityManager.transaction(async manager => {
      const saveUser = await manager.save(manager.create(User, newUser));
      // Set up the profile if provided
      if (createUserDto.profile) {
        saveUser.profile = await manager.save(
          manager.create(UserProfile, { ...createUserDto.profile })
        );
      }
      for (const item of createUserDto.roleIds) {
        await manager.save(
          manager.create(UserRoles, {
            baseRoles: {
              id: item,
            },
            user: saveUser,
          })
        );
      }
      return saveUser.id;
    });

    const getCreatedUser = await this.userRepo.findOne({ where: { id: userId } });

    return getCreatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['profile', 'userRoles', 'userRoles.baseRoles'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        id: id,
      },
      relations: ['profile', 'userRoles', 'userRoles.baseRoles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const getUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: { userRoles: true },
    });
    if (!getUser) {
      throw new BadRequestException('Invalid User');
    }

    const getRoles = await this.baseRolesRepo.findBy({ id: In(updateUserDto.roleIds) });
    if (getRoles.length > 0) {
      throw new BadRequestException('Invalid Role');
    }

    // Re-insert Roles?
    await this.entityManager.transaction(async manager => {
      // Delete All Roles in Users?
      await manager.delete(UserRoles, { user: { id: userId } });
      for (const item of updateUserDto.roleIds) {
        await manager.save(
          manager.create(UserRoles, {
            baseRoles: {
              id: item,
            },
            user: getUser,
          })
        );
      }
    });

    return await this.userRepo.findOne({ where: { id: userId }, relations: { userRoles: true } });
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
  }
}
