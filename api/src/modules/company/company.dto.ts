import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CompanyAddressResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ type: String, nullable: true, example: '123' })
  ward_id: string | null;

  @ApiProperty({ type: String, nullable: true, example: '01' })
  province_id: string | null;

  @ApiProperty({ type: String, nullable: true, example: '12 Nguyễn Trãi' })
  address_detail: string | null;
}

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

  @ApiProperty({ type: () => [CompanyAddressResponseDto] })
  addresses: CompanyAddressResponseDto[];
}

export class UpdateCompanyAddressDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  id?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  ward_id?: string;

  @IsOptional()
  @IsString()
  address_detail?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tax?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name_eng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCompanyAddressDto)
  addresses?: UpdateCompanyAddressDto[];
}
