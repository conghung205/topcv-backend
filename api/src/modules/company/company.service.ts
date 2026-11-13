import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../auth/type';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { CompanyEntity } from './company.entity';
import { CompanyAddressEntity } from './companyAddress.entity';
import { WardEntity } from '../province/ward.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCompanyDto } from './company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyAddressEntity)
    private readonly companyAddressRepository: Repository<CompanyAddressEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async getMe(userId: string, role: Role) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .innerJoin('company.user', 'user')
      .leftJoin('company.addresses', 'address')
      .leftJoin('address.ward', 'ward')
      .select([
        'company.id',
        'company.tax',
        'company.name',
        'company.name_eng',
        'company.description',
        'company.email',
        'company.phone',
        'company.website',
        'company.rate',
        'company.created_at',
        'address.id',
        'address.address_detail',
        'ward.id',
        'ward.province_id',
      ])
      .where('user.id = :userId', { userId })
      .andWhere('user.role = :role', { role })
      .getOne();

    if (!company) {
      throw new NotFoundException();
    }

    const addresses =
      company.addresses?.map((address) => ({
        id: address.id,
        ward_id: address.ward?.id ?? null,
        province_id: address.ward?.province_id ?? null,
        address_detail: address.address_detail,
      })) ?? [];

    return {
      id: company.id,
      tax: company.tax,
      name: company.name,
      name_eng: company.name_eng,
      description: company.description,
      email: company.email,
      phone: company.phone,
      website: company.website,
      rate: company.rate,
      created_at: company.created_at,
      addresses: addresses,
    };
  }

  // update
  async update(userId: string, role: Role, dto: UpdateCompanyDto) {
    const companyAddressMap: Record<string, CompanyAddressEntity> = {};
    const { addresses, email, ...companyFields } = dto;

    const candidateChanges = Object.fromEntries(
      Object.entries(companyFields).filter(([, value]) => value !== undefined),
    );

    const company = await this.companyRepository.findOneBy({ user_id: userId });
    if (!company) throw new NotFoundException();
    const companyAddress = await this.companyAddressRepository.findBy({
      company_id: company.id,
    });

    // insert companyAddress hashmap
    if (companyAddress.length !== 0) {
      companyAddress.forEach((cad) => {
        companyAddressMap[cad.id] = cad;
      });
    }

    // if has data
    const hasCompanyChanges = Object.keys(candidateChanges).length > 0;
    const hasAddressChanges = (addresses?.length ?? 0) > 0;
    const hasEmailChanges = email !== undefined;

    if (hasCompanyChanges || hasAddressChanges || hasEmailChanges) {
      await this.dataSource.transaction(async (manager) => {
        // if hasCompanyChanges
        if (hasCompanyChanges) {
          await manager.update(
            CompanyEntity,
            { user_id: userId },
            candidateChanges,
          );
        }

        // if has email
        if (email !== undefined) {
          const normalizedEmail = email.trim().toLowerCase();

          const existingUser = await manager.findOneBy(UserEntity, {
            email: normalizedEmail,
          });

          const existingCompany = await manager.findOneBy(CompanyEntity, {
            email: normalizedEmail,
          });

          if (existingUser && existingUser.id !== userId) {
            throw new ConflictException();
          }

          if (existingCompany && existingCompany.id !== company.id) {
            throw new ConflictException();
          }

          const companyResult = await manager.update(
            CompanyEntity,
            { user_id: userId },
            { email: normalizedEmail },
          );

          if (companyResult.affected === 0) {
            throw new NotFoundException();
          }

          const userResult = await manager.update(
            UserEntity,
            { id: userId },
            { email: normalizedEmail },
          );

          if (userResult.affected === 0) {
            throw new NotFoundException();
          }
        }

        // if has Addresses
        for (const { id, ward_id, address_detail } of addresses ?? []) {
          // if Addresses payload not exits id is insert
          if (id === undefined) {
            if (!ward_id || !address_detail?.trim()) {
              throw new BadRequestException();
            }

            const ward = await manager.findOneBy(WardEntity, {
              id: ward_id,
            });

            if (!ward) throw new BadRequestException();

            await manager.insert(CompanyAddressEntity, {
              company_id: company.id,
              ward_id,
              address_detail,
            });
            continue;
          }

          // check id hasOwn company
          if (!Object.hasOwn(companyAddressMap, id)) {
            throw new NotFoundException();
          }

          const changes = {
            ...(ward_id !== undefined ? { ward_id } : {}),
            ...(address_detail !== undefined ? { address_detail } : {}),
          };

          if (Object.keys(changes).length > 0) {
            if (ward_id !== undefined) {
              const ward = await manager.findOneBy(WardEntity, {
                id: ward_id,
              });

              if (!ward) {
                throw new BadRequestException();
              }
            }
            const result = await manager.update(
              CompanyAddressEntity,
              { id, company_id: company.id },
              changes,
            );

            if (result.affected === 0) {
              throw new NotFoundException();
            }
          }
        }
      });
    }

    return this.getMe(userId, role);
  }
}
