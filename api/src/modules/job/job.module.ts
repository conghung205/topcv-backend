import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entity/job.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { CompanyEntity } from '../company/company.entity';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { CategoryEntity } from '../category/category.entity';
import { JobAddressEntity } from './entity/jobAddress.entity';
import { CandidateEntity } from '../candidate/candidate.entity';
import { JobApplicationEntity } from '../jobApplication/jobApplication.entity';
import { SavedJobEntity } from '../saveJob/savedJob.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobEntity,
      JobAddressEntity,
      CompanyEntity,
      CompanyAddressEntity,
      CategoryEntity,
      CandidateEntity,
      JobApplicationEntity,
      SavedJobEntity,
    ]),
    AuthModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
