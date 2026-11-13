import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseAppEntity } from '../../common/base/entity';
import { WardEntity } from '../province/ward.entity';
import { UserEntity } from '../auth/user.entity';

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

  @ManyToOne(() => WardEntity, { nullable: true })
  @JoinColumn({ name: 'ward_id' })
  ward: WardEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
