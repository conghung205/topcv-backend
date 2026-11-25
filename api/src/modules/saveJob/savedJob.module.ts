import { Module } from '@nestjs/common';
import { SavedJobController } from './savedJob.controller';
import { SavedJobService } from './savedJob.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedJobEntity } from './savedJob.entity';
import { AuthModule } from '../auth/auth.module';
import { JobModule } from '../job/job.module';
import { CandidateEntity } from '../candidate/candidate.entity';
import { JobEntity } from '../job/entity/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedJobEntity, CandidateEntity, JobEntity]),
    AuthModule,
    JobModule,
  ],
  controllers: [SavedJobController],
  providers: [SavedJobService],
})
export class SavedJobModule {}
