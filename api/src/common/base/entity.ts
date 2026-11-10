import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseAppEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: true })
  created_by: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  modified_at: Date | null;

  @Column({ type: 'bigint', nullable: true })
  modified_by: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @Column({ type: 'bigint', nullable: true })
  deleted_by: string | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
