import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/guards/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard';
import { RoleGuard } from '../../auth/guards/roles.guard';
import { CandidateApplicationService } from '../services/candidateApplication.service';
import type { AuthenticatedRequest } from '../../auth/type';
import {
  CreateJobApplicationDto,
  CreateJobApplicationResponseDto,
  JobApplicationListDataDto,
  JobApplicationQueryDto,
} from '../dto/candidateApplication.dto';
import { ApiSuccessResponse } from '../../../common/decorators/apiSuccessResponse';

@ApiTags('job-applications')
@Controller('job-applications')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('CANDIDATE')
export class CandidateApplicationController {
  constructor(
    private readonly candidateApplicationService: CandidateApplicationService,
  ) {}

  // get list
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'PENDING',
      'REVIEWED',
      'INTERVIEWING',
      'ACCEPTED',
      'REJECTED',
      'WITHDRAWN',
    ],
  })
  @ApiSuccessResponse(
    JobApplicationListDataDto,
    'Get JobsApplication successfully',
  )
  @Get('me')
  getJobsApplication(
    @Req() req: AuthenticatedRequest,
    @Query() query: JobApplicationQueryDto,
  ) {
    return this.candidateApplicationService.getJobsApplication(
      req.user.sub,
      query,
    );
  }

  // create
  @ApiSuccessResponse(
    CreateJobApplicationResponseDto,
    'Job application created successfully',
    HttpStatus.CREATED,
  )
  @Post()
  createJobApplication(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateJobApplicationDto,
  ) {
    return this.candidateApplicationService.createJobApplication(
      req.user.sub,
      dto,
    );
  }

  // withdrawJobApplication
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':applicationId/withdraw')
  withdrawJobApplication(
    @Req() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
  ) {
    return this.candidateApplicationService.withdrawJobApplication(
      req.user.sub,
      applicationId,
    );
  }
}
