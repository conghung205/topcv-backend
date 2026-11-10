import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { BaseService } from '../../common/base/service';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }

  private toCategoryResponse(category: CategoryEntity): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      parent_id: category.parent_id,
      active: category.active,
    };
  }

  async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { page = 1, limit = 10, search = '' } = params ?? {};
    const result = await this.getAll(
      {
        where: {
          ...(search && { name: ILike(`%${search}%`) }),
        },
        order: {
          created_at: 'DESC',
        },
      },
      page,
      limit,
    );

    return {
      ...result,
      items: result?.items.map((category): CategoryResponseDto =>
        this.toCategoryResponse(category),
      ),
    };
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = await this.create(createCategoryDto);
    return this.toCategoryResponse(category);
  }

  async getCategory(id: string | number): Promise<CategoryResponseDto> {
    const category = await this.getOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.toCategoryResponse(category);
  }

  async updateCategory(
    id: string | number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.update(id, updateCategoryDto);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.toCategoryResponse(category);
  }

  async softDeleteCategory(id: string | number) {
    const result = await this.softDelete(id);
    if (!result) {
      throw new NotFoundException('Category not found');
    }
  }
}
