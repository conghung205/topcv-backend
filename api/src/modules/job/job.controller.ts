import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto } from './job.dto';
import type { AuthenticatedRequest } from '../auth/type';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Post()
  createJob(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto) {
    const userId = req.user.sub;
    return this.jobService.createJob(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('RECRUITER')
  @Patch(':id')
  updateJob(
    @Req() req: AuthenticatedRequest,
    @Param('id') jobId: string,
    @Body() dto: CreateJobDto,
  ) {
    const userId = req.user.sub;
    return this.jobService.updateJob(userId, jobId, dto);
  }
}
