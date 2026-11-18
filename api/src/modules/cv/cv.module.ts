import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvEntity } from './cv.entity';
import { CvVersionEntity } from './cvVersion.entity';
import { CvService } from './cv.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { CandidateEntity } from '../candidate/candidate.entity';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    TypeOrmModule.forFeature([CvEntity, CvVersionEntity, CandidateEntity]),
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
