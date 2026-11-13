import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';
import { CompanyEntity } from './company.entity';
import { WardEntity } from '../province/ward.entity';

@Entity('company_address')
export class CompanyAddressEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  company_id: string;

  @Column({ type: 'bigint' })
  ward_id: string;

  @Column({ type: 'text', nullable: true })
  address_detail?: string | null;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => WardEntity, { nullable: true })
  @JoinColumn({ name: 'ward_id' })
  ward: WardEntity;
}
