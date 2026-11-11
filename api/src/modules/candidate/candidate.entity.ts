import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('candidate')
export class CandidateEntity extends BaseAppEntity {
  @Column({ type: 'text' })
  name: string;
  @Column({ type: 'text', nullable: true })
  phone: string | null;
  @Column({ type: 'text', nullable: true })
  email: string | null;
  @Column({ type: 'text', nullable: true })
  gender: string | null;
  @Column({ type: 'bigint', nullable: true })
  ward_id: string | null;
  @Column({ type: 'text', nullable: true })
  address_detail: string | null;
  @Column({ type: 'bigint' })
  user_id: string;
}
