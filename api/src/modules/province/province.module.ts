import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './province.entity';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { WardEntity } from './ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProvinceEntity, WardEntity])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
