import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationMetaDto {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 1 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export abstract class BaseListResponseDto<T> {
  abstract items: T[];

  abstract meta: BasePaginationMetaDto;
}
