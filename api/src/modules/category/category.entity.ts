import { Column, Entity } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';

@Entity('category')
export class CategoryEntity extends BaseAppEntity {
  @Column({ type: 'bigint', nullable: true })
  parent_id: string | null;

  @Column({ type: 'text' })
  name: string;
}
