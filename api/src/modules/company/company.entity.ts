import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

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
}
