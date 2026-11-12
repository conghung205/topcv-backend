import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateEntity } from './candidate.entity';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../auth/type';
import { UserEntity } from '../auth/user.entity';
import { WardEntity } from '../province/ward.entity';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    @InjectRepository(WardEntity)
    private readonly wardRepository: Repository<WardEntity>,
  ) {}

  async getMe(userId: string, role: Role) {
    const user = await this.userRepository.findOneBy({
      id: userId,
      role,
    });

    const candidate = user
      ? await this.candidateRepository.findOneBy({ user_id: user.id })
      : null;

    if (!user || !candidate) {
      throw new NotFoundException();
    }

    const ward =
      candidate.ward_id === null
        ? null
        : await this.wardRepository.findOneBy({ id: candidate.ward_id });

    return {
      id: candidate?.id,
      name: candidate?.name,
      phone: candidate?.phone,
      email: candidate?.email,
      gender: candidate?.gender,
      province_id: ward?.province_id,
      ward_id: ward?.id,
      address_detail: candidate?.address_detail,
      created_at: candidate?.created_at,
    };
  }
}
