import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_profile' })
export class UserProfile extends AbstractEntity<UserProfile> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber?: string;

  @Column()
  empCode?: string;
}
