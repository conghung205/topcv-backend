import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './service';
import {
  CategoryApiResponseDto,
  CategoryApiUpdateResponseDto,
  CategoryListApiResponseDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({
    type: CategoryListApiResponseDto,
  })
  @ResponseMessage('Get categories successfully')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  async getCategories(
    @Query() query: { page?: number; limit?: number; search?: string },
  ) {
    return await this.categoryService.getCategories({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      search: query.search ?? '',
    });
  }

  @ApiOkResponse({
    type: CategoryApiResponseDto,
  })
  @ResponseMessage('Get category successfully')
  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async getCategory(@Param('id') id: string) {
    return await this.categoryService.getCategory(id);
  }

  @ApiCreatedResponse({
    type: CategoryResponseDto,
  })
  @ResponseMessage('Created category successfully')
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOkResponse({
    type: CategoryApiUpdateResponseDto,
  })
  @ResponseMessage('Updated category successfully')
  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async updateCategory(
    @Param('id') id: string | number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  async deleteCategory(@Param('id') id: string | number) {
    return await this.categoryService.softDeleteCategory(id);
  }
}
