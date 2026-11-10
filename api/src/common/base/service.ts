import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  IsNull,
  ObjectLiteral,
  QueryPartialEntity,
  Repository,
} from 'typeorm';

@Injectable()
export class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async getAll(options?: FindManyOptions<T>, page = 1, limit = 10) {
    const [items, total] = await this.repository.findAndCount({
      ...options,
      where: { deleted_at: IsNull(), ...options?.where } as FindOptionsWhere<T>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getById(id: string | number): Promise<T | null> {
    return this.repository.findOneBy({
      id: id,
      deleted_at: IsNull(),
    } as any);
  }

  create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async update(
    id: string | number,
    updateDto: QueryPartialEntity<T>,
  ): Promise<T | null> {
    const result = await this.repository.update(
      { id, deleted_at: IsNull() } as any,
      {
        ...updateDto,
        modified_at: new Date(),
      } as QueryPartialEntity<T>,
    );

    if (!result.affected) {
      return null;
    }
    return this.getById(id);
  }

  async softDelete(id: string | number) {
    const result = await this.repository.update(
      {
        id,
        deleted_at: IsNull(),
      } as any,
      {
        deleted_at: new Date(),
      } as any,
    );

    return (result.affected ?? 0) > 0;
  }
}
