import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SavedJobService } from './savedJob.service';
import { Roles } from '../auth/guards/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { ApiQuery } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/apiSuccessResponse';
import { JobListDataDto } from '../job/job.dto';
import { SearchPaginationQueryDto } from '../../common/base/dto';
import type { AuthenticatedRequest } from '../auth/type';
import { SavedJobResponseDto } from './savedJob.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('CANDIDATE')
@Controller('saved-jobs')
export class SavedJobController {
  constructor(private readonly saveJobService: SavedJobService) {}

  // get saved jobs
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiSuccessResponse(JobListDataDto, 'Get jobs successfully')
  @Get()
  getSavedJobs(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchPaginationQueryDto,
  ) {
    return this.saveJobService.getSavedJobs(req.user.sub, query);
  }

  // save job
  @ApiSuccessResponse(
    SavedJobResponseDto,
    'Saved job successfully',
    HttpStatus.CREATED,
  )
  @Post(':jobId')
  savedJob(@Req() req: AuthenticatedRequest, @Param('jobId') jobId: string) {
    return this.saveJobService.saveJob(req.user.sub, jobId);
  }

  // unsave
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':jobId')
  unsaveJob(@Req() req: AuthenticatedRequest, @Param('jobId') jobId: string) {
    return this.saveJobService.unsaveJob(req.user.sub, jobId);
  }
}
