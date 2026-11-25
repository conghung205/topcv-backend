import { BadRequestException } from '@nestjs/common';

export async function validateImage(file: Express.Multer.File) {
  if (!file?.buffer?.length) {
    throw new BadRequestException('Please select an image');
  }

  const { fileTypeFromBuffer } = await import('file-type');
  const fileType = await fileTypeFromBuffer(file.buffer);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!fileType || !allowedTypes.includes(fileType.mime)) {
    throw new BadRequestException('Invalid image type');
  }
}
