import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './province.entity';
import { ProvinceService } from './service';
import { ProvinceController } from './controller';
import { WardEntity } from './ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProvinceEntity, WardEntity])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
