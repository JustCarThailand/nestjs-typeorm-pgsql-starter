import { AbstractEntity } from '@app/common';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseRoles } from './base-role.entity';

@Entity({ name: 'user_roles' })
export class UserRoles extends AbstractEntity<UserRoles> {
  @ManyToOne(() => User, users => users.userRoles)
  @JoinColumn()
  user: User;

  @ManyToOne(() => BaseRoles, baseRoles => baseRoles.userRoles)
  @JoinColumn()
  @ApiProperty()
  baseRoles: BaseRoles;
}
