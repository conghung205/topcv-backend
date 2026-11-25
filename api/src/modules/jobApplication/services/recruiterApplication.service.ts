import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  JobApplicationEntity,
  JobApplicationStatus,
} from '../jobApplication.entity';
import { IsNull, Repository } from 'typeorm';
import { JobApplicationQueryDto } from '../dto/candidateApplication.dto';
import { CompanyEntity } from '../../company/company.entity';
import { UpdateJobApplicationStatusDto } from '../dto/recruiterApplication.dto';
import { JobEntity } from '../../job/entity/job.entity';

@Injectable()
export class RecruiterApplicationService {
  constructor(
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepository: Repository<JobApplicationEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  // common
  private buildApplicationQuery(companyId: string) {
    return this.jobApplicationRepository
      .createQueryBuilder('job_application')
      .innerJoin(
        'candidate',
        'candidate',
        'candidate.id = job_application.candidate_id',
      )
      .innerJoin(
        'cv_version',
        'cv_version',
        'cv_version.id = job_application.cv_version_id',
      )
      .innerJoin('cv', 'cv', 'cv.id = cv_version.cv_id')
      .innerJoin('job', 'job', 'job.id = job_application.job_id')
      .where('job.company_id = :companyId', { companyId });
  }

  // getJobApplications
  async getJobApplications(
    userId: string,
    query: JobApplicationQueryDto,
    jobId?: string,
  ) {
    const company = await this.companyRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!company) throw new NotFoundException();

    const { page, limit } = query;
    const search = query.search?.trim();

    // baseQuery
    const baseQuery = this.buildApplicationQuery(company.id);

    if (jobId) {
      baseQuery.andWhere('job.id = :jobId', { jobId });
    }

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
      baseQuery.andWhere(
        '(job.title ILIKE :search OR candidate.name ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // count
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
        'candidate.id as candidate_id',
        'candidate.name as candidate_name',
        'candidate.image as candidate_image',
        'candidate.email as candidate_email',
        'cv_version.id as cv_version_id',
        'cv.title as cv_title',
        'cv.type as cv_type',
        'job_application.status as status',
        `json_agg(
              json_build_object(
                'company_address_id', CAST("company_address"."id" AS text),
                'address_detail', "company_address"."address_detail",
                'ward_name', ward.name,
                'province_name', province.name
              )
            ) FILTER (WHERE "company_address"."id" IS NOT NULL) AS "jobAddresses"`,
        'job_application.created_at as created_at',
        'job_application.modified_at as modified_at',
      ])
      .groupBy('job_application.id')
      .addGroupBy('job.id')
      .addGroupBy('candidate.id')
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

  // getJobApplicationsByJobId
  async getJobApplicationsByJobId(
    userId: string,
    jobId: string,
    query: JobApplicationQueryDto,
  ) {
    return this.getJobApplications(userId, query, jobId);
  }

  // get one
  async getJobApplication(userId: string, applicationId: string) {
    const company = await this.companyRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!company) throw new NotFoundException();

    const baseQuery = this.buildApplicationQuery(company.id);

    const jobApplication = await baseQuery
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
        'candidate.id as candidate_id',
        'candidate.name as candidate_name',
        'candidate.image as candidate_image',
        'candidate.email as candidate_email',
        'candidate.phone as candidate_phone',
        'cv_version.id as cv_version_id',
        'cv.title as cv_title',
        'cv.type as cv_type',
        'job_application.status as status',
        'job_application.description as description',
        `json_agg(
              json_build_object(
                'company_address_id', CAST("company_address"."id" AS text),
                'address_detail', "company_address"."address_detail",
                'ward_name', ward.name,
                'province_name', province.name
              )
            ) FILTER (WHERE "company_address"."id" IS NOT NULL) AS "jobAddresses"`,
        'job_application.created_at as created_at',
        'job_application.modified_at as modified_at',
      ])
      .andWhere('job_application.id = :applicationId', { applicationId })
      .groupBy('job_application.id')
      .addGroupBy('job.id')
      .addGroupBy('candidate.id')
      .addGroupBy('cv_version.id')
      .addGroupBy('cv.id')
      .getRawOne();

    if (!jobApplication) {
      throw new NotFoundException('Job application not found');
    }

    return {
      items: {
        ...jobApplication,
        jobAddresses: jobApplication.jobAddresses ?? [],
      },
    };
  }

  // update status
  async updateJobApplicationStatus(
    userId: string,
    applicationId: string,
    dto: UpdateJobApplicationStatusDto,
  ) {
    const company = await this.companyRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!company) throw new NotFoundException();

    const application = await this.buildApplicationQuery(company.id)
      .andWhere('job_application.id = :applicationId', { applicationId })
      .andWhere('job_application.deleted_at IS NULL')
      .getOne();

    if (!application) throw new NotFoundException();

    const allowedTransitions: Record<
      JobApplicationStatus,
      JobApplicationStatus[]
    > = {
      PENDING: ['REVIEWED', 'REJECTED'],
      REVIEWED: ['INTERVIEWING', 'REJECTED'],
      INTERVIEWING: ['ACCEPTED', 'REJECTED'],
      ACCEPTED: [],
      REJECTED: [],
      WITHDRAWN: [],
    };

    if (!allowedTransitions[application.status].includes(dto.status)) {
      throw new ConflictException('Invalid status transition');
    }

    const result = await this.jobApplicationRepository.update(
      {
        id: applicationId,
        status: application.status,
        deleted_at: IsNull(),
      },
      {
        status: dto.status,
        modified_at: new Date(),
        modified_by: userId,
      },
    );

    if (result.affected !== 1) {
      throw new ConflictException('Application status has changed');
    }
  }
}
