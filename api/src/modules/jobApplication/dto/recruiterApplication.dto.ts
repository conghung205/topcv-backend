import { ApiProperty } from '@nestjs/swagger';
import { BasePaginationMetaDto } from '../../../common/base/dto';
import { JobAddressResponseDto } from '../../job/job.dto';
import type { JobApplicationStatus } from '../jobApplication.entity';
import { IsIn } from 'class-validator';

export class RecruiterApplicationItemDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: '2' })
  job_id: string;

  @ApiProperty({ example: 'Backend Developer' })
  job_title: string;

  @ApiProperty({ example: '3' })
  candidate_id: string;

  @ApiProperty()
  candidate_name: string;

  @ApiProperty({ type: String, nullable: true })
  candidate_image: string | null;

  @ApiProperty()
  candidate_email: string;

  @ApiProperty({ example: '4' })
  cv_version_id: string;

  @ApiProperty({ type: String, nullable: true })
  cv_title: string | null;

  @ApiProperty({ enum: ['UPLOAD', 'BUILDER'] })
  cv_type: 'UPLOAD' | 'BUILDER';

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

  @ApiProperty({ type: [JobAddressResponseDto] })
  jobAddresses: JobAddressResponseDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  modified_at: string | null;
}

export class RecruiterApplicationListDataDto {
  @ApiProperty({ type: [RecruiterApplicationItemDto] })
  items: RecruiterApplicationItemDto[];

  @ApiProperty({ type: BasePaginationMetaDto })
  meta: BasePaginationMetaDto;
}

// detail
export class RecruiterApplicationDetailDto extends RecruiterApplicationItemDto {
  @ApiProperty({ type: String, nullable: true })
  candidate_phone: string | null;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;
}

export class RecruiterApplicationDetailDataDto {
  @ApiProperty({ type: RecruiterApplicationDetailDto })
  items: RecruiterApplicationDetailDto;
}

type UpdateStatus = 'REVIEWED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED';
export class UpdateJobApplicationStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'REVIEWED', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'],
  })
  @IsIn(['REVIEWED', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'])
  status: UpdateStatus;
}
