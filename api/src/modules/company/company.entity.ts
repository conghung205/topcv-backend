import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';
import { UserEntity } from '../auth/user.entity';
import { CompanyAddressEntity } from './companyAddress.entity';

@Entity('company')
export class CompanyEntity extends BaseAppEntity {
  @Column({ type: 'text' })
  tax: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  name_eng: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'text' })
  website: string;

  @Column({ type: 'int' })
  rate: number;

  @Column({ type: 'bigint' })
  user_id: string;

  @OneToMany(() => CompanyAddressEntity, (address) => address.company)
  addresses: CompanyAddressEntity[];

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
