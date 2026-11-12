import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyGetMeResponseDto {
  @ApiProperty({ example: '1' })
  id: string;
  @ApiProperty({ example: '10002283' })
  tax: string;
  @ApiProperty({ example: 'Nguyen van a' })
  name: string;
  @ApiProperty({ example: 'Name English' })
  name_eng: string;
  @ApiProperty({ example: 'description example' })
  description: string;
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;
  @ApiProperty({ example: '0987654321' })
  phone: string;
  @ApiProperty({ example: 'example.com.vn' })
  website: string;
  @ApiProperty({ example: 5 })
  rate: number;
  @ApiProperty()
  created_at: Date;
  @ApiPropertyOptional({ example: '1' })
  ward_id?: string;
  @ApiPropertyOptional({ example: '1' })
  province_id?: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  address_detail?: string | null;
}
