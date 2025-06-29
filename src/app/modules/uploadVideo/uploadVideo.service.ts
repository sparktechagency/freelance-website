import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, deleteManyFromS3, uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { TUploadVideo } from './uploadVideo.interface';
import UploadVideo from './uploadVideo.model';

const createUploadVideo = async (files: any, payload: TUploadVideo) => {
    console.log('payload', payload);
    console.log('files', files);

  try {

    const isExist = await UploadVideo.findOne({category:payload.category});

    if(isExist){
      if (files.videos && files.videos.length > 0) {
        const videos: any = await uploadManyToS3(files.videos, 'videos/');
        payload.videos = videos;
      }

      const updateVideos = [...isExist.videos, ...payload.videos];
      console.log('updateVideos', updateVideos);

      const updatedUploadVideo = await UploadVideo.findByIdAndUpdate(isExist._id, {videos:updateVideos}, {new:true});
      console.log('updatedUploadVideo', updatedUploadVideo);
      if (updatedUploadVideo) {
        const allVideo = files.videos.map((video: any) => `${video.path}`);
        await Promise.all(allVideo.map((path: any) => unlink(path)));
      }

      return updatedUploadVideo;

    }else{
      if (files.videos && files.videos.length > 0) {
        const videos: any = await uploadManyToS3(files.videos, 'videos/');
        payload.videos = videos;
      }
      const result = await UploadVideo.create(payload);

      if (result) {
        const allVideo = files.videos.map((video: any) => `${video.path}`);
        await Promise.all(allVideo.map((path: any) => unlink(path)));
      }
      return result;

    }
  } catch (error) {
    try {
        const allVideo = files?.videos?.map((video: any) => `${video.path}`);
        await Promise.all(allVideo?.map((path: any) => unlink(path)));
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};

const getAllUploadVideoQuery = async (query: Record<string, unknown>) => {
  if(query.category){
    const result = await UploadVideo.findOne({category:query.category});
    if (!result) {
      throw new AppError(404, "Uploaded video not found");
    }
    return result;
  }else{
    const UpcreateUploadVideoQuery = new QueryBuilder(
      UploadVideo.find({}),
      query,
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await UpcreateUploadVideoQuery.modelQuery;

    const meta = await UpcreateUploadVideoQuery.countTotal();
    return { meta, result };

  }
  
};

const getSingleUploadVideoQuery = async (id: string) => {
  const video: any = await UploadVideo.findById(id);
  if (!video) {
    throw new AppError(404, 'Video not found!');
  }

  return video;
};

// const updateSingleUpcreateUploadVideoQuery = async (
//   id: string,
//   files: any,
//   payload: any,
// ) => {
//   try {
//     console.log('id', id);
//     console.log('updated payload', payload);

//     // Find existing UpcreateUploadVideo by ID
//     const existingUpcreateUploadVideo: any = await UpcreateUploadVideo.findOne({
//       _id: id,
//       isDeleted: false,
//     });
//     if (!existingUpcreateUploadVideo) {
//       throw new AppError(404, 'UpcreateUploadVideo not found!');
//     }

//     if (files?.image && files?.image.length > 0) {
//       const image: any = await uploadToS3({
//         file: files.image[0],
//         fileName: files.image[0].originalname,
//         folder: 'UpcreateUploadVideos/',
//       });
//       payload.image = image;

//       const result = await UpcreateUploadVideo.findByIdAndUpdate(id, payload, {
//         new: true,
//       });
//       if (result) {
//         const fileDeletePath = `${files.image[0].path}`;
//         await unlink(fileDeletePath);
//       }

//       const key = existingUpcreateUploadVideo.image.split('amazonaws.com/')[1];

//       const deleteImage: any = await deleteFromS3(key);
//       console.log('deleteImage', deleteImage);
//       if (!deleteImage) {
//         throw new AppError(404, 'Blog Image Deleted File !');
//       }

//       return result;
//     } else {
//       const result = await UpcreateUploadVideo.findByIdAndUpdate(id, payload, {
//         new: true,
//       });
//       return result;
//     }
//   } catch (error) {
//     try {
//       const fileDeletePath = `${files.image[0].path}`;
//       await unlink(fileDeletePath);
//     } catch (fsError) {
//       console.error('Error accessing or deleting the image file:', fsError);
//     }
//     throw error;
//   }
// };

const deletedUploadVideoQuery = async (payload: any) => {
  console.log('payload----', payload);
  // console.log('payload--Imagekeys--', payload.imagesurl);

  if (!payload.videourl) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Image is requered to be deleted',
    );
  }

  const key = payload.videourl.split('amazonaws.com/')[1];

  const videoDoc = await UploadVideo.findOne({
    'videos.url': payload.videourl,
  });

  console.log('videoDoc', videoDoc);

  if (!videoDoc) {
    throw new AppError(httpStatus.NOT_FOUND, 'Video not found in the database');
  }

  const deleteImage: any = await deleteFromS3(key);
  console.log('deleteImage', deleteImage);
 
  console.log('videoDoc', videoDoc);


  if (deleteImage) {
    const updatedDoc = await UploadVideo.findOneAndUpdate(
      { 'videos.url': payload.videourl },
      { $pull: { videos: { url: payload.videourl } } },
      { new: true },
    );

    return updatedDoc;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'Video not found in the database');
  }


  // if (!Array.isArray(payload.imagesurl)) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Image keys must be an array of strings.',
  //   );
  // }

  // const keys = payload.imagesurl.map(
  //   (key: string) => key.split('amazonaws.com/')[1],
  // );
  // console.log('keys', keys);

  // const deleteImage: any = await deleteManyFromS3(keys);
  // console.log('deleteImage', deleteImage);

  // if (deleteImage) {
  //   for (let imageurl of payload.imagesurl) {
  //     const videoObject = await UploadVideo.findOne({ 'videos.url': imageurl });
  //     console.log('videoObject', videoObject);

  //     if (!videoObject) {
  //       // Log an error or handle the case where the video object isn't found
  //       // but don't necessarily throw an error that stops the entire process
  //       // if other keys might still be valid.
  //       console.warn(`Video object not found for key: ${imageurl}. Skipping.`);
  //       continue; // Move to the next imageKey
  //     }

  //     const videoIndex = videoObject.videos.findIndex(
  //       (video) => video.url === imageurl,
  //     );
  //     console.log('videoIndex***', videoIndex);

  //     if (videoIndex > -1) {
  //       if (videoObject.videos.length === 1) {
  //         const result = await UploadVideo.findByIdAndDelete(videoObject._id);
  //         console.log('result delete', result);
  //         console.log(`Deleted video object with id: ${videoObject._id}`);
  //       } else if (videoObject.videos.length > 1) {
  //         const result = await UploadVideo.updateOne(
  //           { _id: videoObject._id },
  //           { $pull: { videos: { url: imageurl } } },
  //         );
  //         console.log(`Removed video with key: ${imageurl}`);
  //         console.log('result update', result);
  //       }
  //     } else {
  //       console.warn(
  //         `Video with key: ${imageurl} not found in videoObject.videos array.`,
  //       );
  //     }
  //   }
  //   return 'All specified videos processed successfully.';
  // } else {
  //   throw new AppError(404, 'Error deleting from S3!');
  // }
};


export const uploadVideoService = {
  createUploadVideo,
  getAllUploadVideoQuery,
  //   updateSingleUpcreateUploadVideoQuery,
  getSingleUploadVideoQuery,
  deletedUploadVideoQuery,
};
