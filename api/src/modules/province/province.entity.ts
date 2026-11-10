import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('province')
export class ProvinceEntity extends BaseAppEntity {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  code: string;
}
