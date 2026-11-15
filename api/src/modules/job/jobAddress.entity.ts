import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';
import { JobEntity } from './job.entity';
import { CompanyAddressEntity } from '../company/companyAddress.entity';

@Entity('job_address')
export class JobAddressEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  job_id: string;
  @Column({ type: 'bigint' })
  company_address_id: string;

  @ManyToOne(() => JobEntity)
  @JoinColumn({ name: 'job_id' })
  job: JobEntity;

  @ManyToOne(() => CompanyAddressEntity, { nullable: false })
  @JoinColumn({ name: 'company_address_id' })
  companyAddress: CompanyAddressEntity;
}
