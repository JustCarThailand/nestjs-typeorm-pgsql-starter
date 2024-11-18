import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common';
import { User } from 'src/entities/user.entity';
import { UserRoles } from 'src/entities/user-role.entity';
import { BaseRoles } from 'src/entities/base-role.entity';
import { UserProfile } from 'src/entities/user-profile.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User, UserProfile, UserRoles, BaseRoles])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
