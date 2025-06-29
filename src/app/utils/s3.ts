import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import httpStatus from 'http-status';
import AppError from '../error/AppError';
import config from '../config';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
// import {} from "@aws-sdk/s3-request-presigner"
import fs from 'fs';


export const s3Client = new S3Client({
  region: `${config.aws.region}`,
  credentials: {
    accessKeyId: `${config.aws.accessKeyId}`,
    secretAccessKey: `${config.aws.secretAccessKey}`,
  },
});


export const createNewFileName = (fileName:string)=>{
  const genaratedNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const mainFile = fileName.split('.');
  const firstPart = `${mainFile[0]}-${genaratedNumber}`;
  const secondPart = mainFile.slice(-1)[0];
  const newFileName = `${firstPart}.${secondPart}`;
  return newFileName;

}


//upload a single file
export const uploadToS3 = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { file, fileName, folder }: { file: any; fileName: string; folder: string },
): Promise<string | null> => {
  const newFileName = createNewFileName(fileName);
  const fileKey = `${folder}${newFileName}`;

  try {

    const headCommand = new HeadObjectCommand({
      Bucket: config.aws.bucket,
      Key: fileKey,
    });
    console.log('headCommand', headCommand);

    try {
     const headResult = await s3Client.send(headCommand);
     if(headResult.$metadata.httpStatusCode === 200){
       throw new AppError(httpStatus.CONFLICT, 'File with this name already exists.');
     }

    } catch (headError: any) {
      if (headError.statusCode === httpStatus.CONFLICT) {
        throw new AppError(headError.statusCode, headError.message);
      }
    }

    const uploadCommand = new PutObjectCommand({
      Bucket: config.aws.bucket,
      Key: fileKey,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
    });


    const uploadResult = await s3Client.send(uploadCommand);
    if (
      !uploadResult.$metadata.httpStatusCode ||
      uploadResult.$metadata.httpStatusCode >= 400
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'File Upload failed');
    }

    console.log('upload result==', uploadResult);

    const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${folder}${newFileName}`;

    return url;
  } catch (error: any) {
    console.log('file upload error=====', error);
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

// delete file from s3 bucket
export const deleteFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
    });
  const response =  await s3Client.send(command);
  if (response.$metadata.httpStatusCode === 204) {
    return true;
  } else {
    return false; 
  }
  } catch (error) {
    return false;
  }
};

// upload multiple files

export const uploadManyToS3 = async (
  files: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    path: string,
    size: number
  }[],
  folder: string,
): Promise<{ url: string; key: string }[]> => {
  try {
    
  // const newFileName = createNewFileName();
    const checkPromises = files.map(async (file) => {
      const fileKey = `${folder}${file.originalname}12`;
      const headCommand = new HeadObjectCommand({
        Bucket: config.aws.bucket,
        Key: fileKey,
      });

      try {
      const headResult =  await s3Client.send(headCommand);
      if (headResult.$metadata.httpStatusCode === 200){
        throw new AppError(
          httpStatus.CONFLICT,
          `Upload failed: File '${file.originalname}' already exists.`,
        );
      }
      
      } catch (headError: any) {
        if (headError.statusCode === httpStatus.CONFLICT) {
          throw new AppError(headError.statusCode, headError.message);
        }
      }
    });

    await Promise.all(checkPromises);
    const uploadPromises = files.map(async ({ path, originalname, mimetype }) => {
      const newkeyName = `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;
      const newFileName = createNewFileName(originalname);
      const fileKey = `${folder}${newFileName}`;
      const command = new PutObjectCommand({
        Bucket: config.aws.bucket,
        Key: fileKey,
        // Body: buffer,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
      });
      const uploadResult = await s3Client.send(command);
      if (!uploadResult.$metadata.httpStatusCode || uploadResult.$metadata.httpStatusCode >= 400) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `File Upload failed for '${originalname}'`);
      }

      const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${folder}${newFileName}`;
      return { url, key: newkeyName };
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error:any) {
    throw new AppError(error.statusCode, error.message );
  }
};

export const deleteManyFromS3 = async (keys: string[]) => {
  try {
    const deleteParams = {
      Bucket: config.aws.bucket,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    };

    console.log('S3 Delete Params:', JSON.stringify(deleteParams, null, 2));

    const command = new DeleteObjectsCommand(deleteParams);

    const response = await s3Client.send(command);
    console.log('S3 Delete Response:', JSON.stringify(response, null, 2));

    if (response.$metadata.httpStatusCode === 200) {
      if (response.Errors && response.Errors.length > 0) {
        console.error(
          'S3 Deletion Errors (some objects might not have been deleted):',
          response.Errors,
        );
        return false; 
      }
      return true; 
    } else {
      console.error(
        'S3 Delete request returned non-200 status:',
        response.$metadata.httpStatusCode,
      );
      return false;
    }
  } catch (error) {
    return false;
  }
};
