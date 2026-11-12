import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CandidateGetMeResponseDto {
  @ApiProperty({ example: '1' })
  id: string;
  @ApiProperty({ example: 'Nguyen van a' })
  name: string;
  @ApiProperty({ type: String, nullable: true, example: '0987654321' })
  phone: string | null;
  @ApiProperty({ type: String, nullable: true, example: 'example@gmail.com' })
  email: string | null;
  @ApiProperty({ type: String, nullable: true, example: 'male' })
  gender: string | null;
  @ApiPropertyOptional({ example: '1' })
  province_id?: string;
  @ApiPropertyOptional({ example: '1' })
  ward_id?: string;
  @ApiProperty({ type: String, nullable: true })
  address_detail: string | null;
  @ApiProperty()
  created_at: Date;
}
