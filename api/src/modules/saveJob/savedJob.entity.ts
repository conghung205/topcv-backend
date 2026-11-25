import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('saved_job')
export class SavedJobEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  candidate_id: string;
  @Column({ type: 'bigint' })
  job_id: string;
}
