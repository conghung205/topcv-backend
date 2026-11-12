import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../auth/type';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { CompanyEntity } from './company.entity';
import { CompanyAddressEntity } from './companyAddress.entity';
import { WardEntity } from '../province/ward.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyAddressEntity)
    private readonly companyAddressRepository: Repository<CompanyAddressEntity>,
    @InjectRepository(WardEntity)
    private readonly wardRepository: Repository<WardEntity>,
  ) {}
  async getMe(userId: string, role: Role) {
    const user = await this.userRepository.findOneBy({
      id: userId,
      role,
    });

    const company = user
      ? await this.companyRepository.findOneBy({
          user_id: user?.id,
        })
      : null;

    if (!user || !company) {
      throw new NotFoundException();
    }

    const companyAddress = await this.companyAddressRepository.findOneBy({
      company_id: company?.id,
    });

    const ward = companyAddress
      ? await this.wardRepository.findOneBy({ id: companyAddress.ward_id })
      : null;

    return {
      id: company?.id,
      tax: company?.tax,
      name: company?.name,
      name_eng: company?.name_eng,
      description: company?.description,
      email: company?.email,
      phone: company?.phone,
      website: company?.website,
      rate: company?.rate,
      created_at: company?.created_at,
      ward_id: ward?.id,
      province_id: ward?.province_id,
      address_detail: companyAddress?.address_detail,
    };
  }
}
