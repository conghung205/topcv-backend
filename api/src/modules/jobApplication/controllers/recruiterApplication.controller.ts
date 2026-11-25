import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecruiterApplicationService } from '../services/recruiterApplication.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/guards/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard';
import { RoleGuard } from '../../auth/guards/roles.guard';
import {
  RecruiterApplicationDetailDataDto,
  RecruiterApplicationListDataDto,
  UpdateJobApplicationStatusDto,
} from '../dto/recruiterApplication.dto';
import type { AuthenticatedRequest } from '../../auth/type';
import { ApiSuccessResponse } from '../../../common/decorators/apiSuccessResponse';
import { JobApplicationQueryDto } from '../dto/candidateApplication.dto';

@ApiTags('job-applications')
@Controller('job-applications')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('RECRUITER')
export class RecruiterApplicationController {
  constructor(
    private readonly recruiterApplicationService: RecruiterApplicationService,
  ) {}

  // get all applications
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
    RecruiterApplicationListDataDto,
    'Get job applications successfully',
  )
  @Get('recruiter')
  getJobApplications(
    @Req() req: AuthenticatedRequest,
    @Query() query: JobApplicationQueryDto,
  ) {
    return this.recruiterApplicationService.getJobApplications(
      req.user.sub,
      query,
    );
  }

  // get applications by job
  @ApiSuccessResponse(
    RecruiterApplicationListDataDto,
    'Get job applications successfully',
  )
  @Get('jobs/:jobId')
  getJobApplicationsByJobId(
    @Req() req: AuthenticatedRequest,
    @Param('jobId') jobId: string,
    @Query() query: JobApplicationQueryDto,
  ) {
    return this.recruiterApplicationService.getJobApplicationsByJobId(
      req.user.sub,
      jobId,
      query,
    );
  }

  // get detail
  @ApiSuccessResponse(
    RecruiterApplicationDetailDataDto,
    'Get job application successfully',
  )
  @Get(':applicationId')
  getJobApplication(
    @Req() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
  ) {
    return this.recruiterApplicationService.getJobApplication(
      req.user.sub,
      applicationId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':applicationId/status')
  updateJobApplicationStatus(
    @Req() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
    @Body() dto: UpdateJobApplicationStatusDto,
  ) {
    return this.recruiterApplicationService.updateJobApplicationStatus(
      req.user.sub,
      applicationId,
      dto,
    );
  }
}
