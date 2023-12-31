import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export function ValidatedImage(image: string) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(image, {
      limits: { fileSize: 10 * 1024 * 1024 }, // Limit filesize to 10MB
      fileFilter: (req, file, cb) => {
        // Accept only png, jpg, or jpeg files
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only jpg, jpeg, and png files are allowed!'), false);
        }
        cb(null, true);
      },
    })),
  );
}

export function ValidatedImages(image: string, maxCount: number = 10) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(image, maxCount, {
      limits: { fileSize: 10 * 1024 * 1024 }, // Limit filesize to 10MB
      fileFilter: (req, file, cb) => {
        // Accept only png, jpg, or jpeg files
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only jpg, jpeg, and png files are allowed!'), false);
        }
        cb(null, true);
      },
    })),
  );
}
