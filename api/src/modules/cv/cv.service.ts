import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CvEntity } from './entity/cv.entity';
import { CvVersionEntity } from './entity/cvVersion.entity';
import { CandidateEntity } from '../candidate/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchPaginationQueryDto } from '../../common/base/dto';
import { CreateCvDto, UpdateCvDto } from './dto/cvContent.dto';
import { Role } from '../auth/type';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    @InjectRepository(CvEntity)
    private readonly cvRepository: Repository<CvEntity>,
    @InjectRepository(CvVersionEntity)
    private readonly cvVersionRepository: Repository<CvVersionEntity>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

  private async checkCvAccess(
    userId: string,
    role: Role,
    cvVersionId: string,
  ): Promise<void> {
    const query = this.cvVersionRepository
      .createQueryBuilder('cv_version')
      .where('cv_version.id = :cvVersionId', { cvVersionId });

    if (role === 'CANDIDATE') {
      query
        .innerJoin('cv', 'cv', 'cv.id = cv_version.cv_id')
        .innerJoin('candidate', 'candidate', 'candidate.id = cv.candidate_id')
        .andWhere('candidate.user_id = :userId', { userId })
        .andWhere('candidate.deleted_at IS NULL')
        .andWhere('cv.deleted_at IS NULL');
    } else if (role === 'RECRUITER') {
      query
        .innerJoin(
          'job_application',
          'application',
          'application.cv_version_id = cv_version.id',
        )
        .innerJoin('job', 'job', 'job.id = application.job_id')
        .innerJoin('company', 'company', 'company.id = job.company_id')
        .andWhere('company.user_id = :userId', { userId })
        .andWhere('company.deleted_at IS NULL')
        .andWhere('application.status != :status', {
          status: 'WITHDRAWN',
        });
    } else {
      throw new ForbiddenException();
    }

    const hasAccess = await query.getExists();

    if (!hasAccess) {
      throw new NotFoundException('CV not found');
    }
  }

  // get list
  async getCvs(userId: string, query: SearchPaginationQueryDto) {
    const { page, limit } = query;
    const search = query.search?.trim();

    // baseQuery
    const baseQuery = this.cvRepository
      .createQueryBuilder('cv')
      .innerJoin(
        'cv_version',
        'cv_version',
        `cv_version.cv_id = cv.id
          AND cv_version.version_number = (
          SELECT MAX(v.version_number)
          FROM cv_version v
          WHERE v.cv_id = cv.id
        )`,
      )
      .innerJoin('candidate', 'candidate', 'candidate.id = cv.candidate_id')
      .where('candidate.user_id = :userId', { userId })
      .andWhere('cv.deleted_at IS NULL');

    if (search) {
      baseQuery.andWhere(
        '(cv.title ILIKE :search OR cv_version.file_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // count
    const count = await baseQuery
      .clone()
      .select('COUNT(*)', 'total')
      .getRawOne();

    const total = Number(count.total);

    // select cv
    const cvs = await baseQuery
      .clone()
      .select([
        'cv.id as id',
        'cv.title as title',
        'cv_version.file_name as file_name',
        'cv.type as type',
        'cv_version.id AS cv_version_id',
        'cv.created_at AS created_at',
        'cv.modified_at AS modified_at',
      ])
      .orderBy('cv.id', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    return {
      items: cvs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // get one
  async getOneCv(userId: string, role: Role, cvVersionId: string) {
    // checkCvAccess
    await this.checkCvAccess(userId, role, cvVersionId);

    const cv = await this.cvRepository
      .createQueryBuilder('cv')
      .innerJoin('cv_version', 'cv_version', `cv_version.cv_id = cv.id`)
      .select([
        'cv.id as id',
        'cv.title as title',
        'cv_version.file_name as file_name',
        'cv.type as type',
        'cv_version.id as cv_version_id',
        'cv_version.content as content',
        'cv.created_at AS created_at',
        'cv.modified_at AS modified_at',
      ])
      .where('cv_version.id = :cvVersionId', { cvVersionId })
      .andWhere('cv.type = :type', { type: 'BUILDER' })
      .getRawOne();

    if (!cv) throw new NotFoundException('CV not found');

    return cv;
  }

  // create cv
  async createCv(userId: string, dto: CreateCvDto) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    const result = await this.dataSource.transaction(async (manager) => {
      const newCv = await manager.save(CvEntity, {
        candidate_id: candidate.id,
        title: dto.title,
        created_by: userId,
        type: 'BUILDER',
      });

      const newCvVersion = await manager.save(CvVersionEntity, {
        cv_id: newCv.id,
        version_number: 1,
        content: {
          ...dto.content,
          schemaVersion: 1,
        },
        created_by: userId,
      });

      return {
        cv_id: newCv.id,
        cv_version_id: newCvVersion.id,
      };
    });

    return result;
  }

  // update CV
  async updateCv(userId: string, cvId: string, dto: UpdateCvDto) {
    const { title, content } = dto;

    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    const result = await this.dataSource.transaction(async (manager) => {
      // Locking rows to prevent race conditions
      const cv = await manager.findOne(CvEntity, {
        where: {
          id: cvId,
          candidate_id: candidate.id,
          deleted_at: IsNull(),
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!cv) throw new NotFoundException();

      const latestVersion = await manager.findOne(CvVersionEntity, {
        where: {
          cv_id: cv.id,
        },
        order: {
          version_number: 'DESC',
        },
      });
      if (!latestVersion) throw new NotFoundException();

      let cvVersionId = latestVersion.id;

      if (content) {
        if (cv.type !== 'BUILDER') {
          throw new BadRequestException('Invalid CV type');
        }

        const newCvVersion = await manager.save(CvVersionEntity, {
          cv_id: cvId,
          version_number: latestVersion.version_number + 1,
          content: {
            ...content,
            schemaVersion: 1,
          },
          created_by: userId,
        });

        cvVersionId = newCvVersion.id;
      }

      if (title !== undefined || content !== undefined) {
        await manager.update(
          CvEntity,
          {
            id: cvId,
            candidate_id: candidate.id,
            deleted_at: IsNull(),
          },
          {
            ...(title !== undefined && { title }),
            modified_at: new Date(),
            modified_by: userId,
          },
        );
      }

      return {
        cv_id: cv.id,
        cv_version_id: cvVersionId,
      };
    });

    return result;
  }

  // Upload Cv To Cloudinary
  async uploadCv(userId: string, file: Express.Multer.File) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });
    if (!candidate) throw new NotFoundException();

    // upload to cloudinary
    const upload = await this.cloudinaryService.uploadCv(file.buffer);

    // update db
    const result = await this.dataSource.transaction(async (manager) => {
      const newCv = await manager.save(CvEntity, {
        candidate_id: candidate.id,
        title: file.originalname.replace(/\.pdf$/i, ''),
        type: 'UPLOAD',
        created_by: userId,
      });

      const version = await manager.save(CvVersionEntity, {
        cv_id: newCv.id,
        version_number: 1,
        file_name: file.originalname,
        file_key: upload.public_id,
        created_by: userId,
      });

      return {
        cv_id: newCv.id,
        cv_version_id: version.id,
        file_name: version.file_name,
      };
    });

    return result;
  }

  // get view url
  async getViewUrl(userId: string, role: Role, cvVersionId: string) {
    // checkCvAccess
    await this.checkCvAccess(userId, role, cvVersionId);

    const version = await this.cvVersionRepository
      .createQueryBuilder('cv_version')
      .innerJoin('cv', 'cv', 'cv.id = cv_version.cv_id')
      .select('cv_version.file_key', 'file_key')
      .where('cv_version.id = :cvVersionId', { cvVersionId })
      .andWhere('cv.type = :type', { type: 'UPLOAD' })
      .getRawOne();

    if (!version?.file_key) {
      throw new NotFoundException('CV not found');
    }

    return {
      view_url: this.cloudinaryService.generateCvUrl(version.file_key),
    };
  }

  // delete cv
  async deleteCv(userId: string, cvId: string) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
      deleted_at: IsNull(),
    });

    if (!candidate) throw new NotFoundException();

    const result = await this.cvRepository.update(
      {
        id: cvId,
        candidate_id: candidate.id,
        deleted_at: IsNull(),
      },
      {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    );

    if (result.affected === 0) throw new NotFoundException();
  }
}
