import { ApiProperty } from '@nestjs/swagger';
import type { Role } from '../type';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyEmailDataDto {
  @ApiProperty({ example: '1' })
  user_id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'] })
  role: Role;

  @ApiProperty({ example: true })
  email_verified: boolean;

  @ApiProperty({ example: '<access_token>' })
  access_token: string;

  @ApiProperty({ example: '<refresh_token>' })
  refresh_token: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Email verified successfully' })
  message: string;

  @ApiProperty({ type: VerifyEmailDataDto })
  data: VerifyEmailDataDto;
}

// resend
export class ResendVerificationEmailDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
