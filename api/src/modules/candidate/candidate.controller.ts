import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CandidateService } from './caniddate.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import type { AuthenticatedRequest, Role } from '../auth/type';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { CandidateGetMeResponseDto, UpdateCandidateDto } from './candidate.dto';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageResponseDto } from '../../common/base/dto';
import { validateImage } from '../../common/utils/validateImage';

@ApiTags('candidates')
@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @ApiSuccessResponse(
    CandidateGetMeResponseDto,
    'Information retrieved successfully',
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.candidateService.getMe(userId);
  }

  @ApiSuccessResponse(
    CandidateGetMeResponseDto,
    'Updated candidate successfully',
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Patch('me')
  async updateCandidate(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCandidateDto,
  ) {
    const userId = req.user.sub;
    return this.candidateService.update(userId, dto);
  }

  // upload image
  @ApiSuccessResponse(
    UploadImageResponseDto,
    'Upload Image successfully',
    HttpStatus.CREATED,
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    await validateImage(file);

    return this.candidateService.uploadImage(req.user.sub, file);
  }
}
