import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

type CvType = 'UPLOAD' | 'BUILDER';

@Entity('cv')
export class CvEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  candidate_id: string;
  @Column({ type: 'text', nullable: true })
  title: string | null;
  @Column({ type: 'text' })
  type: CvType;
}
