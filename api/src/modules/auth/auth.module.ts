import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from '../candidate/candidate.entity';
import { CompanyEntity } from '../company/company.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from './user.entity';
import { CompanyAddressEntity } from '../company/companyAddress.entity';
import { RefreshTokenEntity } from './refreshToken.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is required');

        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      CandidateEntity,
      CompanyEntity,
      CompanyAddressEntity,
      RefreshTokenEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
