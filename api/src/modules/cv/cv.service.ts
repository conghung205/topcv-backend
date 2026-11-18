import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DataSource, Repository } from 'typeorm';
import { CvEntity } from './cv.entity';
import { CvVersionEntity } from './cvVersion.entity';
import { CandidateEntity } from '../candidate/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepository: Repository<CandidateEntity>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

  async uploadCv(userId: string, file: Express.Multer.File) {
    const candidate = await this.candidateRepository.findOneBy({
      user_id: userId,
    });

    if (!candidate) throw new NotFoundException();

    // upload from cloudinary
    const upload = await this.cloudinaryService.uploadCv(file.buffer);

    // update db
    const result = await this.dataSource.transaction(async (manager) => {
      const newCv = await manager.save(CvEntity, {
        candidate_id: candidate.id,
        type: 'UPLOAD',
      });

      const version = await manager.save(CvVersionEntity, {
        cv_id: newCv.id,
        version_number: 1,
        file_name: file.originalname,
        file_key: upload.public_id,
      });

      return {
        cv_id: newCv.id,
        cv_version_id: version.id,
        file_name: version.file_name,
      };
    });

    return result;
  }
}
