import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  BaseListResponseDto,
  BasePaginationMetaDto,
} from '../../common/base/dto';

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

export class CategoryListResponseDto extends BaseListResponseDto<CategoryResponseDto> {
  @ApiProperty({ type: [CategoryResponseDto] })
  items: CategoryResponseDto[];

  @ApiProperty({ type: BasePaginationMetaDto })
  meta: BasePaginationMetaDto;
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


