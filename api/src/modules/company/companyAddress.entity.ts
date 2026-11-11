import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('company_address')
export class CompanyAddressEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  company_id: string;

  @Column({ type: 'bigint' })
  ward_id: string;

  @Column({ type: 'text', nullable: true })
  address_detail?: string | null;
}
