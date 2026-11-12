import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './company.entity';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { UserEntity } from '../auth/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CompanyAddressEntity } from './companyAddress.entity';
import { WardEntity } from '../province/ward.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      UserEntity,
      CompanyAddressEntity,
      WardEntity,
    ]),
    AuthModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
