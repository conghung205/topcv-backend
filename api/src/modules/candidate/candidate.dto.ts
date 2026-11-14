import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

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
  @ApiPropertyOptional({ example: '1', nullable: true })
  province_id?: string | null;
  @ApiPropertyOptional({ example: '1', nullable: true })
  ward_id?: string | null;
  @ApiProperty({ type: String, nullable: true })
  address_detail: string | null;
  @ApiProperty()
  created_at: Date;
}

export class UpdateCandidateDto {
  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string | null;

  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ward_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address_detail?: string | null;
}
