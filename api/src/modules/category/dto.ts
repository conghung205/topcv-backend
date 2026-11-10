import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional({ example: '1', description: 'Id danh mục cha' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  parent_id?: string;

  @ApiProperty({ example: 'Kế toán', description: 'Tên danh mục' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Công nghệ thông tin' })
  name: string;

  @ApiPropertyOptional({ example: '2', nullable: true })
  parent_id: string | null;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2026-10-29T02:00:00.000Z' })
  created_at: Date;

  @ApiPropertyOptional({ example: '1', nullable: true })
  created_by: string | null;

  @ApiProperty({ example: '2026-10-29T02:00:00.000Z', nullable: true })
  modified_at: Date | null;

  @ApiPropertyOptional({ example: '1', nullable: true })
  modified_by: string | null;
}

export class CategoryApiResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Get category successfully',
  })
  message: string;

  @ApiProperty({ type: CategoryResponseDto })
  data: CategoryResponseDto;
}

export class CategoryApiUpdateResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Update category successfully',
  })
  message: string;

  @ApiProperty({ type: CategoryResponseDto })
  data: CategoryResponseDto;
}

export class CategoryPaginationMetaDto {
  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class CategoryListResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  items: CategoryResponseDto[];

  @ApiProperty({ type: CategoryPaginationMetaDto })
  meta: CategoryPaginationMetaDto;
}

export class CategoryListApiResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({
    type: String,
    example: 'Get categories successfully',
  })
  message: string;

  @ApiProperty({ type: CategoryListResponseDto })
  data: CategoryListResponseDto;
}
