import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
const s3FileUpload = (uploadDirectory: string) => {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }
  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit for video files
    fileFilter: (req: Request, file, cb) => {
      const allowedMimeTypes = [
        'image/gif',
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/svg',
        'image/webp',
        'application/octet-stream',
        'image/svg+xml',
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/mp3',
        'audio/aac',
        'audio/x-wav',
        'video/mp4',
        'video/webm',
        'video/avi',
        'video/mov',
        'video/mkv',
        'application/pdf', // PDF files
        'application/msword', // .doc files
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            'Only image and video formats like png, jpg, jpeg, svg, webp, mp4, avi, mov, and mkv are allowed',
          ),
        );
      }
    },
  });

  return upload;
};
export default s3FileUpload;
