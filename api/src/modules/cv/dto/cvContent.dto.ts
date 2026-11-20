import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CvLinkDto {
  @ApiProperty({ example: 'GitHub' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'https://github.com/example' })
  @IsUrl()
  url: string;
}

export class CvPersonalInfoDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Backend Developer',
  })
  @IsOptional()
  @IsString()
  jobTitle?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '0912345678' })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Ha Noi' })
  @IsOptional()
  @IsString()
  location?: string | null;

  @ApiPropertyOptional({ type: [CvLinkDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvLinkDto)
  links?: CvLinkDto[] | null;
}

export class CvExperienceDto {
  @ApiProperty({ example: 'FPT Software' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  position: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2025-01' })
  @IsOptional()
  @IsString()
  startDate?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: null })
  @IsOptional()
  @IsString()
  endDate?: string | null;

  @ApiProperty({
    type: [String],
    example: ['Develop RESTful APIs', 'Optimize database queries'],
  })
  @IsArray()
  @IsString({ each: true })
  highlights: string[];
}

export class CvEducationDto {
  @ApiProperty({ example: 'University of Transport and Communications' })
  @IsString()
  school: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Bachelor' })
  @IsOptional()
  @IsString()
  degree?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Information Technology',
  })
  @IsOptional()
  @IsString()
  major?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2023-09' })
  @IsOptional()
  @IsString()
  startDate?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2027-06' })
  @IsOptional()
  @IsString()
  endDate?: string | null;
}

export class CvProjectDto {
  @ApiProperty({ example: 'TopCV Backend' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Recruitment platform using NestJS and PostgreSQL',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'https://github.com/example/project',
  })
  @IsOptional()
  @IsString()
  url?: string | null;
}

export class CvContentDto {
  @ApiProperty({ type: CvPersonalInfoDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CvPersonalInfoDto)
  personalInfo: CvPersonalInfoDto;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Backend developer with experience in NestJS',
  })
  @IsOptional()
  @IsString()
  summary?: string | null;

  @ApiProperty({ type: [CvExperienceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvExperienceDto)
  experiences: CvExperienceDto[];

  @ApiProperty({ type: [CvEducationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvEducationDto)
  education: CvEducationDto[];

  @ApiProperty({ type: [String], example: ['NestJS', 'PostgreSQL', 'Docker'] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({ type: [CvProjectDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CvProjectDto)
  projects: CvProjectDto[];
}

export class CreateCvDto {
  @ApiProperty({
    example: 'CV Backend Developer',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  title: string;

  @ApiProperty({ type: CvContentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CvContentDto)
  content: CvContentDto;
}

export class UpdateCvDto extends PartialType(CreateCvDto, {
  skipNullProperties: false,
}) {}
