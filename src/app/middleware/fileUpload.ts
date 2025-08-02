import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
const fileUpload = (uploadDirectory: string) => {
  if (!fs.existsSync(uploadDirectory)) {
    // console.log('uploadDirectory1', uploadDirectory);
    fs.mkdirSync(uploadDirectory, { recursive: true });

  }

  // if (!fs.existsSync(uploadDirectory)) {
  //   console.log('Directory does not exist. Creating:', uploadDirectory);
  //   try {
  //     fs.mkdirSync(uploadDirectory, { recursive: true });
  //     console.log('Directory created:', uploadDirectory);
  //   } catch (err) {
  //     console.error('Error creating directory:', err);
  //   }
  // } else {
  //   console.log('Directory already exists:', uploadDirectory);
  // }


  const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
      if (file.fieldname === 'profile') {
        cb(null, './public/uploads/profile');
      } else {
        cb(null, uploadDirectory);
      }
    },
    filename: function (req: Request, file, cb) {
      const parts = file.originalname.split('.');
      let extenson;
      if (parts.length > 1) {
        extenson = '.' + parts.pop();
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        parts.shift()!.replace(/\s+/g, '_') + '-' + uniqueSuffix + extenson,
      );
    },
  });
  


   const upload = multer({
     storage,
     limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for video files
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
export default fileUpload;
