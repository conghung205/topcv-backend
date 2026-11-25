import { ApiProperty } from '@nestjs/swagger';

export class SavedJobResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  candidate_id: string;

  @ApiProperty()
  job_id: string;
}
