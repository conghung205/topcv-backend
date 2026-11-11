import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Hsgdhg272r#' })
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}

export class RegisterCandidateDto extends RegisterUserDto {
  @ApiProperty({ example: 'Nguyen van a' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'male' })
  @IsNotEmpty()
  @IsString()
  gender: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: '0912345678' })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string | null;
}
export class RegisterCompanyDto extends RegisterUserDto {
  @ApiProperty({ example: 'Cty TNHH Example' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2653928782' })
  @IsNotEmpty()
  @IsString()
  tax: string;

  @ApiProperty({ example: 'Name English' })
  @IsNotEmpty()
  @IsString()
  name_eng?: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  ward_id: string;

  @ApiProperty({ example: '0912345678' })
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  website: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsString()
  address_detail?: string | null;
}

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}

// response
export class RegisterCandidateDataDto {
  @ApiProperty({ example: '1' })
  user_id: string;

  @ApiProperty({ example: '1' })
  candidate_id: string;

  @ApiProperty({ example: 'candidate@example.com' })
  email: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ type: String, nullable: true, example: null })
  phone: string | null;

  @ApiProperty({ example: '<access_token>' })
  access_token: string;

  @ApiProperty({ example: '<refresh_token>' })
  refresh_token: string;
}

export class RegisterCandidateResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Register successfully' })
  message: string;

  @ApiProperty({ type: RegisterCandidateDataDto })
  data: RegisterCandidateDataDto;
}

export class LoginDataDto {
  @ApiProperty({ example: '1' })
  user_id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-11T16:19:34.686Z',
  })
  created_at: Date;

  @ApiProperty({ example: '<access_token>' })
  access_token: string;

  @ApiProperty({ example: '<refresh_token>' })
  refresh_token: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Login successfully' })
  message: string;

  @ApiProperty({ type: LoginDataDto })
  data: LoginDataDto;
}

export class RegisterCompanyDataDto {
  @ApiProperty({ example: '2' })
  user_id: string;

  @ApiProperty({ example: '1' })
  company_id: string;

  @ApiProperty({ example: 'Cty TNHH Example' })
  name: string;

  @ApiProperty({ example: 'company@example.com' })
  email: string;

  @ApiProperty({ example: '0912345678' })
  phone: string;

  @ApiProperty({ example: '<access_token>' })
  access_token: string;

  @ApiProperty({ example: '<refresh_token>' })
  refresh_token: string;
}

export class RegisterCompanyResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Register successfully' })
  message: string;

  @ApiProperty({ type: RegisterCompanyDataDto })
  data: RegisterCompanyDataDto;
}
