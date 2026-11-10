import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
}

export class ProvinceListResponseDto {
  @ApiProperty({ type: [ProvinceResponseDto] })
  items: ProvinceResponseDto[];
}

export class ProvinceApiResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Get province successfully',
  })
  message: string;

  @ApiProperty({ type: ProvinceResponseDto })
  data: ProvinceResponseDto;
}

export class WardApiResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Get ward with provinceId successfully',
  })
  message: string;

  @ApiProperty({ type: ProvinceResponseDto })
  data: ProvinceResponseDto;
}
