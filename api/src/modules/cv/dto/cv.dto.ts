import { ApiProperty } from '@nestjs/swagger';
import {
  BaseListResponseDto,
  BasePaginationMetaDto,
} from '../../../common/base/dto';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { CvContentDto } from './cvContent.dto';

export class UploadCvResponseDto {
  @ApiProperty({ example: '15' })
  cv_id: string;

  @ApiProperty({ example: '32' })
  cv_version_id: string;

  @ApiProperty({ type: String, nullable: true, example: 'CV-Nguyen-Van-A.pdf' })
  file_name: string | null;
}

export class CvResponseDto {
  @ApiProperty({ example: '2' })
  id: string;

  @ApiProperty({ type: String, nullable: true })
  title: string | null;

  @ApiProperty({ type: String, nullable: true })
  file_name: string | null;

  @ApiProperty({ enum: ['UPLOAD', 'BUILDER'] })
  type: 'UPLOAD' | 'BUILDER';

  @ApiProperty({ example: '2' })
  cv_version_id: string;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  modified_at: Date | null;
}

export class CvListResponseDto extends BaseListResponseDto<CvResponseDto> {
  @ApiProperty({ type: [CvResponseDto] })
  items: CvResponseDto[];

  @ApiProperty({ type: BasePaginationMetaDto })
  meta: BasePaginationMetaDto;
}

export class CreateCvResponseDto {
  @ApiProperty()
  cv_id: string;

  @ApiProperty()
  cv_version_id: string;
}

export class UpdateCvResponseDto extends CreateCvResponseDto {}

export class CvContentResponseDto extends CvContentDto {
  @ApiProperty({ example: 1 })
  schemaVersion: number;
}

export class CvDetailResponseDto extends CvResponseDto {
  @ApiProperty({ type: CvContentResponseDto })
  content: CvContentResponseDto;
}
