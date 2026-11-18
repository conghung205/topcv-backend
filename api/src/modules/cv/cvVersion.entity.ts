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
    jobTitle?: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: { label: string; url: string }[];
  };

  summary?: string;

  experiences: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    highlights: string[];
  }[];

  education: {
    id: string;
    school: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
  }[];

  skills: string[];

  projects: {
    id: string;
    name: string;
    description?: string;
    url?: string;
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
