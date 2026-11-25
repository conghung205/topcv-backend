import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import {
  BasePaginationMetaDto,
  SearchPaginationQueryDto,
} from '../../../common/base/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { JobApplicationStatus } from '../jobApplication.entity';
import { JobAddressResponseDto } from '../../job/job.dto';

// create
export class CreateJobApplicationDto {
  @IsNumberString()
  job_id: string;

  @IsNumberString()
  cv_version_id: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class CreateJobApplicationResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: '2' })
  job_id: string;

  @ApiProperty({ example: '3' })
  cv_version_id: string;

  @ApiProperty({ example: 'PENDING' })
  status: JobApplicationStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-22T14:30:00.000Z',
  })
  created_at: Date;
}

// query
export class JobApplicationQueryDto extends SearchPaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([
    'PENDING',
    'REVIEWED',
    'INTERVIEWING',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN',
  ])
  status?: JobApplicationStatus;
}

// get
export class JobApplicationItemDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: '2' })
  job_id: string;

  @ApiProperty({ example: 'Backend Developer' })
  job_title: string;

  @ApiProperty({ example: '3' })
  company_id: string;

  @ApiProperty()
  company_name: string;

  @ApiProperty({ type: String, nullable: true })
  company_image: string | null;

  @ApiProperty({ type: String, nullable: true })
  job_requirement: string | null;

  @ApiProperty({ type: String, nullable: true })
  job_benefit: string | null;

  @ApiProperty({ type: Number, nullable: true })
  job_experience: number | null;

  @ApiProperty({ type: String, format: 'date', nullable: true })
  job_due_date: string | null;

  @ApiProperty({ type: Number, nullable: true })
  job_min_salary: number | null;

  @ApiProperty({ type: Number, nullable: true })
  job_max_salary: number | null;

  @ApiProperty({ type: String, nullable: true })
  job_qualification: string | null;

  @ApiProperty({ type: String, nullable: true })
  job_work_type: string | null;

  @ApiProperty({ type: String, nullable: true })
  job_working_time: string | null;

  @ApiProperty({ example: '4' })
  cv_version_id: string;

  @ApiProperty({ type: String, nullable: true })
  cv_title: string | null;

  @ApiProperty({
    enum: [
      'PENDING',
      'REVIEWED',
      'INTERVIEWING',
      'ACCEPTED',
      'REJECTED',
      'WITHDRAWN',
    ],
  })
  status: JobApplicationStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  modified_at: string | null;

  @ApiProperty({ type: [JobAddressResponseDto] })
  jobAddresses: JobAddressResponseDto[];
}

export class JobApplicationListDataDto {
  @ApiProperty({ type: [JobApplicationItemDto] })
  items: JobApplicationItemDto[];

  @ApiProperty({ type: BasePaginationMetaDto })
  meta: BasePaginationMetaDto;
}
