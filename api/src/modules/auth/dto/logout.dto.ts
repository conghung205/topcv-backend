import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty({ example: 'Logout successfully' })
  message: string;
}
