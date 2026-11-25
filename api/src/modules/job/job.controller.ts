import {
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
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import {
  CreateJobDto,
  JobDetailDataDto,
  JobListDataDto,
  UpdateJobDto,
} from './job.dto';
import type {
  AuthenticatedRequest,
  OptionalAuthenticatedRequest,
} from '../auth/type';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import {
  PaginationQueryDto,
  SearchPaginationQueryDto,
} from '../../common/base/dto';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { OptionalJwtAuthGuard } from '../auth/guards/OptionalJwtAuth.guard';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // find many
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiSuccessResponse(JobListDataDto, 'Get jobs successfully')
  @Get()
  getJobs(@Query() query: SearchPaginationQueryDto) {
    return this.jobService.getJobs(query);
  }

  // find one OptionalJwtAuthGuard
  @ApiSuccessResponse(JobDetailDataDto, 'Get job successfully')
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getJob(@Req() req: OptionalAuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user?.sub;
    return this.jobService.getJob(id, userId);
  }

  // create job
  @ApiSuccessResponse(
    JobDetailDataDto,
    'Created job successfully',
    HttpStatus.CREATED,
  )
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Post()
  createJob(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto) {
    const userId = req.user.sub;
    return this.jobService.createJob(userId, dto);
  }

  // update job
  @ApiSuccessResponse(JobDetailDataDto, 'Updated job successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Patch(':id')
  updateJob(
    @Req() req: AuthenticatedRequest,
    @Param('id') jobId: string,
    @Body() dto: UpdateJobDto,
  ) {
    const userId = req.user.sub;
    return this.jobService.updateJob(userId, jobId, dto);
  }

  // softDelete
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Delete(':id')
  softDeleteJob(@Req() req: AuthenticatedRequest, @Param('id') jobId: string) {
    const userId = req.user.sub;
    return this.jobService.softDelete(jobId, userId);
  }
}
