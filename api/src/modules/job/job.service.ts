import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/company.entity';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { CategoryEntity } from '../category/category.entity';
import { JobEntity } from './job.entity';
import { JobAddressEntity } from './jobAddress.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyAddressEntity)
    private readonly companyAddressRepository: Repository<CompanyAddressEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    private readonly dataSource: DataSource,
  ) {}

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

    return job;
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
  }
}
