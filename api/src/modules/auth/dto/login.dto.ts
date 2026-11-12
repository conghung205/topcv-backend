import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
