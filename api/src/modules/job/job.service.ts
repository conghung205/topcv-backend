import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/company.entity';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { CategoryEntity } from '../category/category.entity';
import { JobEntity } from './entity/job.entity';
import {
  PaginationQueryDto,
  SearchPaginationQueryDto,
} from '../../common/base/dto';
import { JobAddressEntity } from './entity/jobAddress.entity';
import { CandidateEntity } from '../candidate/candidate.entity';
import { JobApplicationEntity } from '../jobApplication/jobApplication.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyAddressEntity)
    private readonly companyAddressRepository: Repository<CompanyAddressEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepository: Repository<JobApplicationEntity>,

    private readonly dataSource: DataSource,
  ) {}

  // get many
  async getJobs(query: SearchPaginationQueryDto) {
    const { page, limit } = query;
    const search = query.search?.trim();

    const baseQuery = this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company', 'company.deleted_at IS NULL')
      .innerJoin('job.category', 'category', 'category.deleted_at IS NULL')
      .where('job.deleted_at IS NULL');

    if (search) {
      baseQuery.andWhere('job.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const countResult = await baseQuery
      .clone()
      .select('COUNT(*)', 'total')
      .getRawOne();
    const total = Number(countResult?.total ?? 0);

    const jobs = await baseQuery
      .clone()
      .leftJoin('job.jobAddresses', 'address', 'address.deleted_at IS NULL')
      .leftJoin(
        'address.companyAddress',
        'companyAddress',
        'companyAddress.deleted_at IS NULL',
      )
      .leftJoin('companyAddress.ward', 'ward')
      .leftJoin('province', 'province', 'province.id = ward.province_id')
      .select([
        'job.id AS id',
        'job.title AS title',
        'job.requirement AS requirement',
        'job.due_date AS due_date',
        'job.qualification AS qualification',
        'job.work_type AS work_type',
        'job.working_time AS working_time',
        'company.name AS company_name',
        'category.name AS category_name',
        `json_agg(
          json_build_object(
            'company_address_id', CAST("companyAddress"."id" AS text),
            'address_detail', "companyAddress"."address_detail",
            'ward_name', ward.name,
            'province_name', province.name
          )
        ) FILTER (WHERE "companyAddress"."id" IS NOT NULL) AS "jobAddresses"`,
      ])
      .groupBy('job.id')
      .addGroupBy('company.id')
      .addGroupBy('category.id')
      .orderBy('job.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();

    return {
      items: jobs.map((job) => ({
        ...job,
        jobAddresses: job.jobAddresses ?? [],
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // get one
  async getJob(jobId: string, userId: string | undefined) {
    let application: JobApplicationEntity | null = null;
    
    if (userId) {
      const candidate = await this.candidateRepository.findOneBy({
        user_id: userId,
        deleted_at: IsNull(),
      });

      if (candidate) {
        application = await this.jobApplicationRepository.findOneBy({
          job_id: jobId,
          candidate_id: candidate.id,
          status: Not(In(['WITHDRAWN', 'REJECTED'])),
        });
      }
    }

    const job = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company', 'company.deleted_at IS NULL')
      .innerJoin('job.category', 'category', 'category.deleted_at IS NULL')
      .leftJoin('job.jobAddresses', 'address', 'address.deleted_at IS NULL')
      .leftJoin(
        'address.companyAddress',
        'companyAddress',
        'companyAddress.deleted_at IS NULL',
      )
      .leftJoin('companyAddress.ward', 'ward')
      .leftJoin('province', 'province', 'province.id = ward.province_id')
      .select([
        'job.id AS id',
        'job.title AS title',
        'job.description AS description',
        'job.requirement AS requirement',
        'job.benefit AS benefit',
        'job.experience AS experience',
        'job.due_date AS due_date',
        'job.min_salary AS min_salary',
        'job.max_salary AS max_salary',
        'job.qualification AS qualification',
        'job.work_type AS work_type',
        'job.working_time AS working_time',
        'job.created_at AS created_at',
        'company.name AS company_name',
        'category.name AS category_name',
        `json_agg(
          json_build_object(
            'company_address_id', CAST("companyAddress"."id" AS text),
            'address_detail', "companyAddress"."address_detail",
            'ward_name', ward.name,
            'province_name', province.name
          )
        ) FILTER (WHERE "companyAddress"."id" IS NOT NULL) AS "jobAddresses"`,
      ])
      .where('job.id = :jobId', { jobId })
      .andWhere('job.deleted_at IS NULL')
      .groupBy('job.id')
      .addGroupBy('company.id')
      .addGroupBy('category.id')
      .getRawOne();

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      items: {
        ...job,
        jobAddresses: job.jobAddresses ?? [],
        has_applied: !!application,
        application_id: application?.id ?? null,
      },
    };
  }

  // create job
  async createJob(userId: string, dto: CreateJobDto) {
    const { company_address_ids, ...jobFields } = dto;
    const companyAddressIds = Array.from(new Set(company_address_ids));

    const company = await this.companyRepository.findOneBy({
      user_id: userId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const category = await this.categoryRepository.findOneBy({
      id: dto.category_id,
      deleted_at: IsNull(),
    });

    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    const matchedAddresses = await this.companyAddressRepository.findBy({
      id: In(companyAddressIds),
      company_id: company.id,
      deleted_at: IsNull(),
    });

    if (matchedAddresses.length !== companyAddressIds.length) {
      throw new BadRequestException('Invalid company address');
    }

    // insert table
    const job = await this.dataSource.transaction(async (manager) => {
      const savedJob = await manager.save(JobEntity, {
        ...jobFields,
        company_id: company.id,
      });

      const jobAddresses = matchedAddresses.map((address) => ({
        job_id: savedJob.id,
        company_address_id: address.id,
      }));

      await manager.insert(JobAddressEntity, jobAddresses);

      return savedJob;
    });

    return this.getJob(job.id, userId);
  }

  // update Job
  async updateJob(userId: string, jobId: string, dto: Partial<CreateJobDto>) {
    const { company_address_ids, ...jobFields } = dto;

    const jobChanges = Object.fromEntries(
      Object.entries(jobFields).filter(([, value]) => value !== undefined),
    );

    // has data changes
    const hasJobChanges = Object.keys(jobChanges).length > 0;

    // if company_address_ids is empty array
    if (company_address_ids !== undefined) {
      if (
        !Array.isArray(company_address_ids) ||
        company_address_ids.length === 0
      ) {
        throw new BadRequestException();
      }
    }

    const company = await this.companyRepository.findOneBy({
      user_id: userId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (dto.category_id) {
      const category = await this.categoryRepository.findOneBy({
        id: dto.category_id,
        deleted_at: IsNull(),
      });

      if (!category) {
        throw new BadRequestException('Invalid category');
      }
    }

    await this.dataSource.transaction(async (manager) => {
      // find job
      const job = await manager.findOneBy(JobEntity, {
        id: jobId,
        company_id: company.id,
        deleted_at: IsNull(),
      });

      if (!job) throw new NotFoundException();

      // if hasJobChanges
      if (hasJobChanges) {
        await manager.update(
          JobEntity,
          {
            id: jobId,
            company_id: company.id,
            deleted_at: IsNull(),
          },
          jobChanges,
        );
      }

      // if has address
      if (company_address_ids !== undefined) {
        const companyAddressIds = Array.from(new Set(company_address_ids));
        const matchedAddresses = await manager.findBy(CompanyAddressEntity, {
          id: In(companyAddressIds),
          company_id: company.id,
          deleted_at: IsNull(),
        });

        if (matchedAddresses.length !== companyAddressIds.length) {
          throw new BadRequestException('Invalid company address');
        }

        // get jobAddress
        const jobAddress = await manager.findBy(JobAddressEntity, {
          job_id: job.id,
          deleted_at: IsNull(),
        });

        // Get current Address Id
        const currentAddressIds = jobAddress.map(
          (row) => row.company_address_id,
        );

        // if the DB does not yet have ID from the payload, add it to the DB
        const addressesToAdd = companyAddressIds.filter(
          (addressId) => !currentAddressIds.includes(addressId),
        );

        // If it exists in the DB but is absent from the payload, perform a soft delete.
        const jobAddressRowsToRemove = jobAddress.filter(
          (row) => !companyAddressIds.includes(row.company_address_id),
        );

        if (jobAddressRowsToRemove.length > 0) {
          await manager.update(
            JobAddressEntity,
            {
              job_id: job.id,
              id: In(jobAddressRowsToRemove.map((row) => row.id)),
              deleted_at: IsNull(),
            },
            { deleted_at: new Date() },
          );
        }

        if (addressesToAdd.length > 0) {
          await manager.insert(
            JobAddressEntity,
            addressesToAdd.map((addressId) => ({
              job_id: job.id,
              company_address_id: addressId,
            })),
          );
        }
      }
    });

    return this.getJob(jobId, userId);
  }

  // delete job
  async softDelete(jobId: string, userId: string) {
    const company = await this.companyRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const result = await this.jobRepository.update(
      {
        id: jobId,
        deleted_at: IsNull(),
        company_id: company.id,
      },
      {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    );

    if (result.affected === 0) throw new NotFoundException();
  }
}
