import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { TokenPayload } from './interfaces/token-payload.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login(users: User, response: Response) {
    const getUser = await this.usersService.getUser(users.id);
    const roles = await this.usersService.getUserRole(users.id);
    const roleName = roles.map(item => item.baseRoles.name);
    const roleCode = roles.map(item => item.baseRoles.code);
    const uuid = uuidv4();

    const tokenPayload: TokenPayload = {
      userId: getUser.id,
      username: getUser.username,
      uuid: uuid,
      userRoles: {
        userRoleNames: roleName,
        userRoleCodes: roleCode,
      },
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        parseInt(this.configService.getOrThrow<number>('APP_JWT_EXPIRATION', { infer: true }))
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return { accessToken: token, user: tokenPayload };
  }
}
