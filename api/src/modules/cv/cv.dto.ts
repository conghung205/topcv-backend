import { ApiProperty } from '@nestjs/swagger';

export class UploadCvResponseDto {
  @ApiProperty({ example: '15' })
  cv_id: string;

  @ApiProperty({ example: '32' })
  cv_version_id: string;

  @ApiProperty({ type: String, nullable: true, example: 'CV-Nguyen-Van-A.pdf' })
  file_name: string | null;
}
