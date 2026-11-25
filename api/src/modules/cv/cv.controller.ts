import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import {
  CreateCvResponseDto,
  CvDetailResponseDto,
  CvListResponseDto,
  UpdateCvResponseDto,
  UploadCvResponseDto,
} from './dto/cv.dto';
import { SearchPaginationQueryDto } from '../../common/base/dto';
import { ApiQuery } from '@nestjs/swagger';
import { CreateCvDto, UpdateCvDto } from './dto/cvContent.dto';

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  // get list
  @ApiSuccessResponse(CvListResponseDto, 'Get List CV successfully')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Get()
  getCvs(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchPaginationQueryDto,
  ) {
    const userId = req.user.sub;

    return this.cvService.getCvs(userId, query);
  }

  // get one
  @ApiSuccessResponse(CvDetailResponseDto, 'Get CV successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE', 'RECRUITER')
  @Get('versions/:cvVersionId')
  getCv(
    @Req() req: AuthenticatedRequest,
    @Param('cvVersionId') cvVersionId: string,
  ) {
    const { sub, role } = req.user;

    return this.cvService.getOneCv(sub, role, cvVersionId);
  }

  // create new cv
  @ApiSuccessResponse(
    CreateCvResponseDto,
    'Created CV successfully',
    HttpStatus.CREATED,
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Post()
  createNewCv(@Req() req: AuthenticatedRequest, @Body() dto: CreateCvDto) {
    const userId = req.user.sub;

    return this.cvService.createCv(userId, dto);
  }

  // upload cv
  @ApiSuccessResponse(
    UploadCvResponseDto,
    'Upload CV successfully',
    HttpStatus.CREATED,
  )
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

  // Get view url
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE', 'RECRUITER')
  @Get('versions/:cvVersionId/view-url')
  getViewUrl(
    @Param('cvVersionId') cvVersionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { sub, role } = req.user;

    return this.cvService.getViewUrl(sub, role, cvVersionId);
  }

  // updateCv
  @ApiSuccessResponse(UpdateCvResponseDto, 'Updated CV successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Patch(':cvId')
  updateCv(
    @Param('cvId') cvId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCvDto,
  ) {
    const userId = req.user.sub;

    return this.cvService.updateCv(userId, cvId, dto);
  }

  // delete cv
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('CANDIDATE')
  @Delete(':cvId')
  deleteCv(@Param('cvId') cvId: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;

    return this.cvService.deleteCv(userId, cvId);
  }
}
