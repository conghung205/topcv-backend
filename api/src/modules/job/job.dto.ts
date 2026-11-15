import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import { BasePaginationMetaDto } from '../../common/base/dto';

export class CreateJobDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2' })
  @IsString()
  @Matches(/^[1-9]\d*$/)
  category_id: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  requirement?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  benefit?: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number | null;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  due_date?: string | null;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 10000000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  min_salary?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 15000000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_salary?: number | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  qualification?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  work_type?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  working_time?: string | null;

  @ApiProperty({ type: [String], example: ['3', '5'] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[1-9]\d*$/, { each: true })
  company_address_ids: string[];
}

export class UpdateJobDto extends PartialType(CreateJobDto, {
  skipNullProperties: false,
}) {}

// response

export class JobAddressResponseDto {
  @ApiProperty({ example: '2' })
  company_address_id: string;

  @ApiProperty({ type: String, nullable: true, example: 'Số 10, đường A' })
  address_detail: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'Phường Ba Đình' })
  ward_name: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'Thành phố Hà Nội' })
  province_name: string | null;
}

export class JobDetailDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Backend Developer' })
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  requirement: string;

  @ApiProperty()
  benefit: string;

  @ApiProperty({ example: 0 })
  experience: number;

  @ApiProperty({
    format: 'date-time',
    example: '2026-11-15T00:00:00.000Z',
  })
  due_date: string;

  @ApiProperty({ example: 10000000 })
  min_salary: number;

  @ApiProperty({ example: 15000000 })
  max_salary: number;

  @ApiProperty()
  qualification: string;

  @ApiProperty()
  work_type: string;

  @ApiProperty()
  working_time: string;

  @ApiProperty({
    format: 'date-time',
    example: '2026-11-15T15:21:05.908Z',
  })
  created_at: string;

  @ApiProperty({ example: 'Cty TNHH Example' })
  company_name: string;

  @ApiProperty({ example: 'Công nghệ thông tin' })
  category_name: string;

  @ApiProperty({ type: [JobAddressResponseDto] })
  jobAddresses: JobAddressResponseDto[];
}

export class JobDetailDataDto {
  @ApiProperty({ type: JobDetailDto })
  items: JobDetailDto;
}

// get many
export class JobListItemDto extends OmitType(JobDetailDto, [
  'description',
  'benefit',
  'experience',
  'min_salary',
  'max_salary',
  'created_at',
] as const) {}

export class JobListDataDto {
  @ApiProperty({ type: [JobListItemDto] })
  items: JobListItemDto[];

  @ApiProperty({ type: BasePaginationMetaDto })
  meta: BasePaginationMetaDto;
}
