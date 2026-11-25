import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateEntity } from '../../candidate/candidate.entity';
import { In, IsNull, Not, QueryFailedError, Repository } from 'typeorm';
import { JobApplicationEntity } from '../jobApplication.entity';
import {
  CreateJobApplicationDto,
  JobApplicationQueryDto,
} from '../dto/candidateApplication.dto';
import { CvVersionEntity } from '../../cv/entity/cvVersion.entity';
import { JobEntity } from '../../job/entity/job.entity';
@Injectable()
export class CandidateApplicationService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepository: Repository<JobApplicationEntity>,
    @InjectRepository(CvVersionEntity)
    private readonly cvVersionRepository: Repository<CvVersionEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async createJobApplication(userId: string, dto: CreateJobApplicationDto) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    // find cvVersion
    const cvVersion = await this.cvVersionRepository
      .createQueryBuilder('cv_version')
      .innerJoin('cv', 'cv', 'cv.id = cv_version.cv_id')
      .where('cv_version.id = :cvVersionId', {
        cvVersionId: dto.cv_version_id,
      })
      .andWhere('cv.candidate_id = :candidateId', {
        candidateId: candidate.id,
      })
      .andWhere('cv.active = true')
      .andWhere('cv.deleted_at IS NULL')
      .getOne();
    if (!cvVersion) throw new NotFoundException();

    // find job
    const job = await this.jobRepository.findOneBy({
      id: dto.job_id,
      active: true,
      deleted_at: IsNull(),
    });
    if (!job) throw new BadRequestException();

    // find candidateHasApplied
    const candidateHasApplied = await this.jobApplicationRepository.findOneBy({
      job_id: dto.job_id,
      candidate_id: candidate.id,
      status: Not(In(['WITHDRAWN', 'REJECTED'])),
    });
    if (candidateHasApplied)
      throw new ConflictException('You have already applied for this job');

    // save
    try {
      const application = await this.jobApplicationRepository.save({
        job_id: dto.job_id,
        cv_version_id: dto.cv_version_id,
        candidate_id: candidate.id,
        description: dto.description,
        status: 'PENDING',
      });

      return {
        id: application.id,
        job_id: application.job_id,
        cv_version_id: application.cv_version_id,
        status: application.status,
        created_at: application.created_at,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as {
          code?: string;
          constraint?: string;
        };

        if (
          driverError.code === '23505' &&
          driverError.constraint === 'uq_job_application_job_candidate'
        ) {
          throw new ConflictException('You have already applied for this job');
        }
      }

      throw error;
    }
  }

  // get jobs application
  async getJobsApplication(userId: string, query: JobApplicationQueryDto) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    const { page, limit } = query;
    const search = query.search?.trim();

    // baseQuery
    const baseQuery = this.jobApplicationRepository
      .createQueryBuilder('job_application')
      .innerJoin('job', 'job', 'job.id = job_application.job_id')
      .innerJoin(
        'cv_version',
        'cv_version',
        'cv_version.id = job_application.cv_version_id',
      )
      .innerJoin('cv', 'cv', 'cv.id = cv_version.cv_id')
      .innerJoin('company', 'company', 'company.id = job.company_id')
      .where('job_application.candidate_id = :candidateId', {
        candidateId: candidate.id,
      });

    // filter
    if (query.status) {
      baseQuery.andWhere('job_application.status = :status', {
        status: query.status,
      });
    } else {
      baseQuery.andWhere('job_application.status != :withdrawn', {
        withdrawn: 'WITHDRAWN',
      });
    }

    if (search) {
      baseQuery.andWhere('job.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // conut
    const countResult = await baseQuery
      .clone()
      .select('COUNT(*)', 'total')
      .getRawOne();
    const total = Number(countResult?.total ?? 0);

    const jobsApplication = await baseQuery
      .clone()
      .leftJoin(
        'job_address',
        'job_address',
        'job_address.job_id = job.id AND job_address.deleted_at IS NULL',
      )
      .leftJoin(
        'company_address',
        'company_address',
        'company_address.id = job_address.company_address_id AND company_address.deleted_at IS NULL',
      )
      .leftJoin('ward', 'ward', 'ward.id = company_address.ward_id')
      .leftJoin('province', 'province', 'province.id = ward.province_id')
      .select([
        'job_application.id as id',
        'job.id as job_id',
        'job.title as job_title',
        'company.id as company_id',
        'company.name as company_name',
        'company.image as company_image',
        'job.requirement as job_requirement',
        'job.benefit as job_benefit',
        'job.experience as job_experience',
        'job.due_date as job_due_date',
        'job.min_salary as job_min_salary',
        'job.max_salary as job_max_salary',
        'job.qualification as job_qualification',
        'job.work_type as job_work_type',
        'job.working_time as job_working_time',
        'cv_version.id as cv_version_id',
        'cv.title as cv_title',
        'job_application.status as status',
        'job_application.created_at as created_at',
        'job_application.modified_at as modified_at',
        `json_agg(
          json_build_object(
            'company_address_id', CAST("company_address"."id" AS text),
            'address_detail', "company_address"."address_detail",
            'ward_name', ward.name,
            'province_name', province.name
          )
        ) FILTER (WHERE "company_address"."id" IS NOT NULL) AS "jobAddresses"`,
      ])
      .groupBy('job_application.id')
      .addGroupBy('job.id')
      .addGroupBy('company.id')
      .addGroupBy('cv_version.id')
      .addGroupBy('cv.id')
      .orderBy('job_application.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();

    return {
      items: jobsApplication.map((jobApplication) => ({
        ...jobApplication,
        jobAddresses: jobApplication.jobAddresses ?? [],
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // WITHDRAWN
  async withdrawJobApplication(userId: string, applicationId: string) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    const result = await this.jobApplicationRepository.update(
      {
        candidate_id: candidate.id,
        id: applicationId,
        status: In(['PENDING', 'REVIEWED', 'INTERVIEWING']),
      },
      {
        status: 'WITHDRAWN',
        modified_at: new Date(),
        modified_by: userId,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('No withdrawable application found');
    }
  }
}
