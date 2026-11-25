import {
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
import { CompanyService } from './company.service';
import type { AuthenticatedRequest } from '../auth/type';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CompanyGetMeResponseDto, UpdateCompanyDto } from './company.dto';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UploadImageResponseDto } from '../../common/base/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateImage } from '../../common/utils/validateImage';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiSuccessResponse(
    CompanyGetMeResponseDto,
    'Information retrieved successfully',
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.companyService.getMe(userId);
  }

  @ApiSuccessResponse(CompanyGetMeResponseDto, 'Updated company successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Patch('me')
  updateCompany(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCompanyDto,
  ) {
    const userId = req.user.sub;
    return this.companyService.update(userId, dto);
  }

  // upload image
  @ApiSuccessResponse(
    UploadImageResponseDto,
    'Upload Image successfully',
    HttpStatus.CREATED,
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    await validateImage(file);

    return this.companyService.uploadImage(req.user.sub, file);
  }
}
