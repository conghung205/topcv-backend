import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateJobDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2' })
  @IsString()
  @Matches(/^[1-9]\d*$/)
  category_id: string;

  @ApiProperty({ type: [String], example: ['3', '5'] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[1-9]\d*$/, { each: true })
  company_address_ids: string[];

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
}
