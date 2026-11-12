import { CandidateEntity } from '../candidate/candidate.entity';
import {
  DataSource,
  EntityManager,
  IsNull,
  MoreThan,
  Repository,
} from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterCandidateDto } from './dto/registerCandidate.dto';
import { RegisterCompanyDto } from './dto/registerCompany.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateRefreshToken, hashRefreshToken } from './helpers/refreshToken';
import { RefreshTokenEntity } from './refreshToken.entity';
import { CompanyEntity } from '../company/company.entity';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  private ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  // save refresh token and generate accessToken
  private async issueTokens(
    manager: EntityManager,
    user: Pick<UserEntity, 'id' | 'role'>,
  ) {
    const refreshToken = generateRefreshToken();

    await manager.save(RefreshTokenEntity, {
      user_id: user.id,
      token: hashRefreshToken(refreshToken),
      expires_at: this.getRefreshTokenExpiresAt(),
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private getRefreshTokenExpiresAt(): Date {
    return new Date(Date.now() + this.ttlDays * 24 * 60 * 60 * 1000);
  }

  // Create Candidate
  async registerCandidate(dto: RegisterCandidateDto) {
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
        email: dto.email,
        gender: dto.gender,
        phone: dto.phone,
      });

      // save refresh token and generate accessToken
      const tokens = await this.issueTokens(manager, user);

      return {
        user_id: user.id,
        candidate_id: candidate.id,
        email: user.email,
        name: candidate.name,
        phone: candidate.phone,
        ...tokens,
      };
    });

    return result;
  }

  // Create Company
  async registerCompany(dto: RegisterCompanyDto) {
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

      // save refresh token and generate accessToken
      const tokens = await this.issueTokens(manager, user);

      return {
        user_id: user.id,
        company_id: company.id,
        name: company.name,
        email: user.email,
        phone: company.phone,
        ...tokens,
      };
    });

    return result;
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
      return this.issueTokens(manager, user);
    });

    return {
      user_id: user.id,
      email: user.email,
      active: user.active,
      created_at: user.created_at,
      ...result,
    };
  }

  // logout
  async logout(dto: RefreshTokenDto) {
    const tokenHash = hashRefreshToken(dto.refresh_token);
    const now = new Date();
    await this.refreshTokenRepository.update(
      {
        token: tokenHash,
        revoked_at: IsNull(),
      },
      { revoked_at: now },
    );
  }

  // Refresh Token
  async refreshToken(dto: RefreshTokenDto) {
    const tokenHash = hashRefreshToken(dto.refresh_token);

    const storedToken = await this.refreshTokenRepository.findOneBy({
      token: tokenHash,
      revoked_at: IsNull(),
    });
    if (!storedToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({
      id: storedToken.user_id,
      active: true,
      deleted_at: IsNull(),
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const newRefreshToken = generateRefreshToken();
    const now = new Date();

    const result = await this.dataSource.transaction(async (manager) => {
      const updateResult = await manager.update(
        RefreshTokenEntity,
        {
          id: storedToken.id,
          revoked_at: IsNull(),
          expires_at: MoreThan(now),
        },
        { revoked_at: now },
      );

      if (updateResult.affected !== 1) {
        throw new UnauthorizedException();
      }

      return this.issueTokens(manager, user);
    });

    return result;
  }
}
