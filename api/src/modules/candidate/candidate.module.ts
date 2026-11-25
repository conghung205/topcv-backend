import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from './candidate.entity';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './caniddate.service';
import { UserEntity } from '../auth/user.entity';
import { AuthModule } from '../auth/auth.module';
import { WardEntity } from '../province/ward.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateEntity, UserEntity, WardEntity]),
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService],
})
export class CandidateModule {}
