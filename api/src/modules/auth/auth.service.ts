import { CandidateEntity } from '../candidate/candidate.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterCandidateDto, RegisterCompanyDto } from './auth.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateRefreshToken, hashRefreshToken } from './helpers/refreshToken';
import { RefreshTokenEntity } from './refreshToken.entity';
import { CompanyEntity } from '../company/company.entity';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  private getRefreshTokenExpiresAt(): Date {
    return new Date(Date.now() + this.ttlDays * 24 * 60 * 60 * 1000);
  }

  // Create Candidate
  async registerCandidate(dto: RegisterCandidateDto) {
    const newRefreshToken = generateRefreshToken();
    const hashPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.dataSource.transaction(async (manager) => {
      // create user
      const user = await manager.save(UserEntity, {
        email: dto.email,
        password: hashPassword,
        role: 'CANDIDATE',
      });

      // create candidate
      const candidate = await manager.save(CandidateEntity, {
        user_id: user.id,
        name: dto.name,
        gender: dto.gender,
        phone: dto.phone,
      });

      // save refresh token
      await manager.save(RefreshTokenEntity, {
        user_id: user.id,
        token: hashRefreshToken(newRefreshToken),
        expires_at: this.getRefreshTokenExpiresAt(),
      });

      // create acccessToken
      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        role: user.role,
      });

      return {
        user_id: user.id,
        candidate_id: candidate.id,
        email: user.email,
        name: candidate.name,
        phone: candidate.phone,
        access_token: accessToken,
      };
    });

    return {
      ...result,
      refresh_token: newRefreshToken,
    };
  }

  // Create Company
  async registerCompany(dto: RegisterCompanyDto) {
    const newRefreshToken = generateRefreshToken();
    const hashPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.dataSource.transaction(async (manager) => {
      // create user
      const user = await manager.save(UserEntity, {
        email: dto.email,
        password: hashPassword,
        role: 'RECRUITER',
      });

      // create candidate
      const company = await manager.save(CompanyEntity, {
        user_id: user.id,
        tax: dto.tax,
        name: dto.name,
        name_eng: dto.name_eng,
        email: dto.email,
        phone: dto.phone,
        website: dto.website,
      });

      // address
      await manager.save(CompanyAddressEntity, {
        company_id: company.id,
        ward_id: dto.ward_id,
        address_detail: dto.address_detail,
      });

      // save refresh token
      await manager.save(RefreshTokenEntity, {
        user_id: user.id,
        token: hashRefreshToken(newRefreshToken),
        expires_at: this.getRefreshTokenExpiresAt(),
      });

      // create acccessToken
      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        role: user.role,
      });

      return {
        user_id: user.id,
        company_id: company.id,
        name: company.name,
        email: user.email,
        phone: company.phone,
        access_token: accessToken,
      };
    });

    return {
      ...result,
      refresh_token: newRefreshToken,
    };
  }

  //login
  async login(dto: LoginDto, role: 'CANDIDATE' | 'RECRUITER') {
    const user = await this.userRepository.findOneBy({
      email: dto.email,
      role,
      active: true,
      deleted_at: IsNull(),
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatchPassword = await bcrypt.compare(dto.password, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException();
    }

    // generateRefreshToken
    const newRefreshToken = generateRefreshToken();

    const result = await this.dataSource.transaction(async (manager) => {
      // save refresh token
      await manager.save(RefreshTokenEntity, {
        user_id: user.id,
        token: hashRefreshToken(newRefreshToken),
        expires_at: this.getRefreshTokenExpiresAt(),
      });

      // create acccessToken
      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        role: user.role,
      });

      return {
        access_token: accessToken,
      };
    });

    return {
      user_id: user.id,
      email: user.email,
      active: user.active,
      created_at: user.created_at,
      ...result,
      refresh_token: newRefreshToken,
    };
  }
}
