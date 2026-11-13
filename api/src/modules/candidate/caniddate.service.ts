import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateEntity } from './candidate.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Role } from '../auth/type';
import { UserEntity } from '../auth/user.entity';
import { WardEntity } from '../province/ward.entity';
import { UpdateCandidateDto } from './candidate.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    private dataSource: DataSource,
  ) {}

  async getMe(userId: string, role: Role) {
    const candidate = await this.candidateRepository
      .createQueryBuilder('candidate')
      .innerJoin('candidate.user', 'user')
      .leftJoin('candidate.ward', 'ward')
      .select([
        'candidate.id',
        'candidate.name',
        'candidate.phone',
        'candidate.email',
        'candidate.gender',
        'candidate.address_detail',
        'candidate.created_at',
        'ward.id',
        'ward.province_id',
      ])
      .where('user.id = :userId', { userId })
      .andWhere('user.role = :role', { role })
      .getOne();

    if (!candidate) {
      throw new NotFoundException();
    }

    return {
      id: candidate.id,
      name: candidate.name,
      phone: candidate.phone,
      email: candidate.email,
      gender: candidate.gender,
      province_id: candidate.ward?.province_id ?? null,
      ward_id: candidate.ward?.id ?? null,
      address_detail: candidate.address_detail,
      created_at: candidate.created_at,
    };
  }

  // update
  async update(
    userId: string,
    role: Role,
    dto: DeepPartial<UpdateCandidateDto>,
  ) {
    const candidateChanges = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(candidateChanges).length > 0) {
      await this.dataSource.transaction(async (manager) => {
        const result = await manager.update(
          CandidateEntity,
          { user_id: userId },
          candidateChanges,
        );

        if (result.affected === 0) {
          throw new NotFoundException();
        }

        if (dto.email !== undefined && dto.email !== null) {
          await manager.update(
            UserEntity,
            { id: userId },
            { email: dto.email },
          );
        }
      });
    }

    return this.getMe(userId, role);
  }
}
