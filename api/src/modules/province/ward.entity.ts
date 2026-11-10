import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('ward')
export class WardEntity extends BaseAppEntity {
  @Column({ type: 'bigint' })
  province_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  code: string;
}
