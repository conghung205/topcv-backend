import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('job_address')
export class JobAddressEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  job_id: string;
  @Column({ type: 'bigint' })
  company_address_id: string;
}
