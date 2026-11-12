import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import type { AuthenticatedRequest } from '../auth/type';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CompanyGetMeResponseDto } from './company.dto';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiSuccessResponse(
    CompanyGetMeResponseDto,
    'Information retrieved successfully',
  )
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.companyService.getMe(userId, 'RECRUITER');
  }
}
