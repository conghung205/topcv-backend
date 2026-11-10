import { Module } from '@nestjs/common';
import { CategoryService } from './service';
import { CategoryController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
