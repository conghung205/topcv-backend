import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CandidateService } from './caniddate.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import type { AuthenticatedRequest, Role } from '../auth/type';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { CandidateGetMeResponseDto } from './candidate.dto';

@ApiTags('candidate')
@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @ApiSuccessResponse(
    CandidateGetMeResponseDto,
    'Information retrieved successfully',
  )
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.candidateService.getMe(userId, 'CANDIDATE');
  }
}
