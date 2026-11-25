import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedJobEntity } from './savedJob.entity';
import { IsNull, Repository } from 'typeorm';
import { JobService } from '../job/job.service';
import { SearchPaginationQueryDto } from '../../common/base/dto';
import { CandidateEntity } from '../candidate/candidate.entity';
import { JobEntity } from '../job/entity/job.entity';

@Injectable()
export class SavedJobService {
  constructor(
    @InjectRepository(SavedJobEntity)
    private readonly savedJobRepository: Repository<SavedJobEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,

    private readonly jobService: JobService,
  ) {}

  async getSavedJobs(userId: string, query: SearchPaginationQueryDto) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    return this.jobService.getJobs(userId, query, candidate.id);
  }

  //   create save job
  async saveJob(userId: string, jobId: string) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    const job = await this.jobRepository.findOneBy({
      id: jobId,
      deleted_at: IsNull(),
    });

    if (!job) throw new NotFoundException('Job not found');

    const result = await this.savedJobRepository.upsert(
      {
        candidate_id: candidate.id,
        job_id: jobId,
        // If the two columns conflict, update these columns
        created_by: userId,
        deleted_at: null,
        deleted_by: null,
        modified_at: new Date(),
        modified_by: userId,
      },
      {
        conflictPaths: ['candidate_id', 'job_id'],
      },
    );

    return {
      id: result.identifiers[0].id,
      candidate_id: candidate.id,
      job_id: jobId,
    };
  }

  // unsaveJob
  async unsaveJob(userId: string, jobId: string) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    // unsave
    const result = await this.savedJobRepository.update(
      {
        candidate_id: candidate.id,
        job_id: jobId,
        deleted_at: IsNull(),
      },
      {
        deleted_at: new Date(),
        deleted_by: userId,
        modified_at: new Date(),
        modified_by: userId,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Saved job not found');
    }
  }
}
