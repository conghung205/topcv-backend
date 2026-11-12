import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class RefreshTokenDataDto {
  @ApiProperty({ example: '<access_token>' })
  access_token: string;

  @ApiProperty({ example: '<refresh_token>' })
  refresh_token: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Refresh token successfully' })
  message: string;

  @ApiProperty({ type: RefreshTokenDataDto })
  data: RefreshTokenDataDto;
}
