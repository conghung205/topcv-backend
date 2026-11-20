import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

type CvContent = {
  schemaVersion: 1;

  personalInfo: {
    fullName: string;
    jobTitle?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    links?: { label: string; url: string }[] | null;
  };

  summary?: string | null;

  experiences: {
    company: string;
    position: string;
    startDate?: string | null;
    endDate?: string | null;
    highlights: string[];
  }[];

  education: {
    school: string;
    degree?: string | null;
    major?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  }[];

  skills: string[];

  projects: {
    name: string;
    description?: string | null;
    url?: string | null;
  }[];
};

@Entity('cv_version')
export class CvVersionEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  cv_id: string;

  @Column({ type: 'integer' })
  version_number: number;

  @Column({ type: 'text', nullable: true })
  file_name: string | null;

  @Column({ type: 'text', nullable: true })
  file_key: string | null;

  @Column({ type: 'jsonb', nullable: true })
  content: CvContent | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: true })
  created_by: string | null;
}
