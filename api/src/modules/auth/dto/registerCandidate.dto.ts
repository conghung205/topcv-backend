import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { RegisterUserDto } from './registerUser.dto';

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
