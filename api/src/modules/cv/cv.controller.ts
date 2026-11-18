import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import type { AuthenticatedRequest } from '../auth/type';
import { UploadCvResponseDto } from './cv.dto';

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @ApiSuccessResponse(UploadCvResponseDto, 'Upload CV successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file?.buffer || !file.buffer.subarray(0, 1024).includes('%PDF-')) {
      throw new BadRequestException('Vui lòng chọn file PDF');
    }
    const userId = req.user.sub;

    return this.cvService.uploadCv(userId, file);
  }
}
