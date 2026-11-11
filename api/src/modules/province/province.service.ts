import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../common/base/service';
import { ProvinceEntity } from './province.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import { ProvinceListResponseDto, ProvinceResponseDto } from './province.dto';
import { WardEntity } from './ward.entity';

@Injectable()
export class ProvinceService extends BaseService<ProvinceEntity> {
  constructor(
    @InjectRepository(ProvinceEntity)
    private provinceRepository: Repository<ProvinceEntity>,
    @InjectRepository(WardEntity)
    private readonly wardRepository: Repository<WardEntity>,
  ) {
    super(provinceRepository);
  }

  private toProvinceResponse(province: ProvinceEntity): ProvinceResponseDto {
    return {
      id: province.id,
      name: province.name,
      code: province.code,
    };
  }

  async getProvince(params: { search?: string }) {
    const { search = '' } = params;
    const result = await this.getAll({
      where: {
        ...(search && { name: ILike(`%${search}%`) }),
      },
      order: {
        code: 'DESC',
      },
    });

    return {
      ...result,
      items: result?.items.map((province): ProvinceResponseDto =>
        this.toProvinceResponse(province),
      ),
    };
  }

  async getWardWithProvinceId(provinceId: string) {
    const result = await this.wardRepository.find({
      select: { id: true, name: true, code: true },
      where: {
        province_id: provinceId,
        active: true,
        deleted_at: IsNull(),
      },
      order: { name: 'ASC' },
    });

    return result;
  }
}
