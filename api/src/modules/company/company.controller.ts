import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import type { AuthenticatedRequest } from '../auth/type';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CompanyGetMeResponseDto, UpdateCompanyDto } from './company.dto';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

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
}
