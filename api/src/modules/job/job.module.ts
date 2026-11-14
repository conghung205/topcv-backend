import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './job.entity';
import { JobAddressEntity } from './jobAddress.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { CompanyEntity } from '../company/company.entity';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { CategoryEntity } from '../category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobEntity,
      JobAddressEntity,
      CompanyEntity,
      CompanyAddressEntity,
      CategoryEntity,
    ]),
    AuthModule,
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
