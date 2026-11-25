import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

export type JobApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'INTERVIEWING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

@Entity('job_application')
export class JobApplicationEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  job_id: string;
  @Column({ type: 'bigint' })
  candidate_id: string;
  @Column({ type: 'text', nullable: true })
  description?: string | null;
  @Column({ type: 'text' })
  status: JobApplicationStatus;
  @Column({ type: 'bigint' })
  cv_version_id: string;
}
