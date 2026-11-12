import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { RegisterUserDto } from './registerUser.dto';

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
