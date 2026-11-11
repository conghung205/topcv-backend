import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';
import type { Role } from './type';

@Entity('users')
export class UserEntity extends BaseAppEntity {
  @Column({ type: 'text' })
  email: string;
  @Column({ type: 'text' })
  password: string;
  @Column({ type: 'text' })
  role: Role;
}
