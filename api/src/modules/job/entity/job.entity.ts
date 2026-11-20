import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseAppEntity } from '../../../common/base/entity';
import { CompanyEntity } from '../../company/company.entity';
import { CategoryEntity } from '../../category/category.entity';
import { JobAddressEntity } from './jobAddress.entity';

@Entity('job')
export class JobEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  category_id: string;
  @Column({ type: 'bigint' })
  company_id: string;
  @Column({ type: 'text' })
  title: string;
  @Column({ type: 'text', nullable: true })
  description: string | null;
  @Column({ type: 'text', nullable: true })
  requirement: string | null;
  @Column({ type: 'text', nullable: true })
  benefit: string | null;
  @Column({ type: 'integer', nullable: true })
  experience: number | null;
  @Column({ type: 'date', nullable: true })
  due_date: string | null;
  @Column({ type: 'integer' })
  quantity: number;
  @Column({ type: 'integer', nullable: true })
  min_salary: number | null;
  @Column({ type: 'integer', nullable: true })
  max_salary: number | null;
  @Column({ type: 'text', nullable: true })
  qualification: string | null;
  @Column({ type: 'text', nullable: true })
  work_type: string | null;
  @Column({ type: 'text', nullable: true })
  working_time: string | null;

  @OneToMany(() => JobAddressEntity, (address) => address.job)
  jobAddresses: JobAddressEntity[];

  @ManyToOne(() => CompanyEntity, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => CategoryEntity, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
