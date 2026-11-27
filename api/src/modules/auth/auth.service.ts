import { CandidateEntity } from '../candidate/candidate.entity';
import {
  DataSource,
  EntityManager,
  IsNull,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { RedisService } from '../redis/redis.service';
import { MailProducer } from '../mail/mail.producer';
import { createHash, randomBytes } from 'node:crypto';
import {
  ResendVerificationEmailDto,
  VerifyEmailDto,
} from './dto/verifyEmail.dto';

@Injectable()
export class AuthService {
  private ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
    private readonly mailProducer: MailProducer,
  ) {}

  // =========== common ============
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

  // send mail
  private async sendVerificationEmail(userId: string, email: string) {
    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.redisService.set(`verify-email:${tokenHash}`, userId, 1800);

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.mailProducer.addEmail(
      email,
      'Verify your email',
      `<a href="${verifyUrl}">Verify your email</a>`,
    );
  }
  // =============== end common =======================

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

      return {
        user_id: user.id,
        candidate_id: candidate.id,
        email: user.email,
        name: candidate.name,
        phone: candidate.phone,
      };
    });

    // send verify email
    await this.sendVerificationEmail(result.user_id, result.email);

    return {
      ...result,
      email_verified: false,
    };
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

      return {
        user_id: user.id,
        company_id: company.id,
        name: company.name,
        email: user.email,
        phone: company.phone,
      };
    });

    // send verify email
    await this.sendVerificationEmail(result.user_id, result.email);

    return {
      ...result,
      email_verified: false,
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

    // Check user has verified email.
    if (!user.email_verified_at) {
      throw new ForbiddenException('Please verify your email');
    }

    // save refresh token and generate accessToken
    const token = await this.dataSource.transaction(async (manager) => {
      return this.issueTokens(manager, user);
    });

    return {
      user_id: user.id,
      email: user.email,
      active: user.active,
      created_at: user.created_at,
      ...token,
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
      email_verified_at: Not(IsNull()),
    });

    if (!user) {
      throw new UnauthorizedException();
    }

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

  // verify email
  async verifyEmail(dto: VerifyEmailDto) {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');

    const userId = await this.redisService.getDel(`verify-email:${tokenHash}`);
    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }

    // result
    const result = await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOneBy(UserEntity, {
        id: userId,
        active: true,
        deleted_at: IsNull(),
        email_verified_at: IsNull(),
      });
      if (!user) {
        throw new BadRequestException('Unable to verify email');
      }

      // update email_verified_at
      const updateUser = await manager.update(
        UserEntity,
        {
          id: user.id,
          active: true,
          deleted_at: IsNull(),
          email_verified_at: IsNull(),
        },
        {
          email_verified_at: new Date(),
        },
      );
      if (updateUser.affected !== 1) {
        throw new ConflictException('Unable to verify email');
      }

      // save refresh token and generate accessToken
      const tokens = await this.issueTokens(manager, user);

      return {
        user_id: user.id,
        email: user.email,
        role: user.role,
        email_verified: true,
        ...tokens,
      };
    });

    return result;
  }

  // resend email
  async resendVerificationEmail(dto: ResendVerificationEmailDto) {
    const user = await this.userRepository.findOneBy({
      email: dto.email,
      active: true,
      deleted_at: IsNull(),
      email_verified_at: IsNull(),
    });

    if (!user) return;

    const result = await this.redisService.setIfNotExists(
      `resend-verification:${user.id}`,
      '1',
      60,
    );

    if (!result) return;

    await this.sendVerificationEmail(user.id, user.email);
  }
}
