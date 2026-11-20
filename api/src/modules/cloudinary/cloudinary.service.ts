import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  uploadAvatar(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', asset_folder: 'avatars' },
        (error, result) => {
          if (error || !result) {
            reject(
              error ?? new Error('Cloudinary did not return an upload result'),
            );
            return;
          }

          resolve(result);
        },
      );

      stream.end(buffer);
    });
  }

  // upload cv
  uploadCv(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          type: 'authenticated',
          asset_folder: 'cvs',
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error ?? new Error('Cloudinary did not return an upload result'),
            );
            return;
          }

          resolve(result);
        },
      );
      stream.end(buffer);
    });
  }

  // generate cv
  generateCvUrl(publicId: string): string {
    return cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'image',
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + 5 * 60,
      attachment: false,
    });
  }
}
