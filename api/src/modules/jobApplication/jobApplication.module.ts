import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationEntity } from './jobApplication.entity';
import { CandidateEntity } from '../candidate/candidate.entity';
import { CompanyEntity } from '../company/company.entity';
import { CandidateApplicationController } from './controllers/candidateApplication.controller';
import { RecruiterApplicationController } from './controllers/recruiterApplication.controller';
import { CandidateApplicationService } from './services/candidateApplication.service';
import { RecruiterApplicationService } from './services/recruiterApplication.service';
import { AuthModule } from '../auth/auth.module';
import { CvVersionEntity } from '../cv/entity/cvVersion.entity';
import { CvEntity } from '../cv/entity/cv.entity';
import { JobEntity } from '../job/entity/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobApplicationEntity,
      JobEntity,
      CandidateEntity,
      CompanyEntity,
      CvVersionEntity,
      CvEntity,
    ]),
    AuthModule,
  ],
  controllers: [CandidateApplicationController, RecruiterApplicationController],
  providers: [CandidateApplicationService, RecruiterApplicationService],
})
export class JobApplicationModule {}
