import { AbstractEntity } from '@app/common';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';
import { UserRoles } from './user-role.entity';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  username: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column()
  @Exclude()
  passwordSalt: string;

  @Column()
  @Exclude()
  passwordIter: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserRoles, userRoles => userRoles.user)
  userRoles: UserRoles[];

  @OneToOne(() => UserProfile)
  @JoinColumn()
  profile?: UserProfile;

  @Column()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP(6) AT TIME ZONE 'UTC+7'",
    onUpdate: "CURRENT_TIMESTAMP(6) AT TIME ZONE 'UTC+7'",
  })
  updated_at: Date;
}
