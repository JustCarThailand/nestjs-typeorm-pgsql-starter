import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from './user-role.entity';

@Entity({ name: 'base_roles' })
export class BaseRoles extends AbstractEntity<BaseRoles> {
  @Column()
  @ApiProperty()
  code: number;

  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => UserRoles, userRoles => userRoles.baseRoles)
  userRoles: UserRoles[];
}
