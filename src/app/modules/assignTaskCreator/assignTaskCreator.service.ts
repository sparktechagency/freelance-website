import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TAssignTaskCreator } from './assignTaskCreator.interface';
import AssignTaskCreator from './assignTaskCreator.model';
import Creator from '../creator/creator.model';
import HireCreator from '../hireCreator/hireCreator.model';
import { User } from '../user/user.models';
import Subscription from '../subscription/subscription.model';
import { deleteManyFromS3, uploadManyToS3 } from '../../utils/s3';
import { unlink } from 'fs/promises';
import mongoose from 'mongoose';
import paypalClient from '../../utils/paypal';

const createAssignTaskCreator = async (payload: any) => {
  console.log('AssignTaskCreator payload=', payload);

  if (!payload.creatorsIds || !payload.hireCreatorId || !payload.price) {
    throw new AppError(
      403,
      'Creator ID, Hire Creator ID, and price are required',
    );
  }

  const existHireCreator = await HireCreator.findById(payload.hireCreatorId);
  if (!existHireCreator) {
    throw new AppError(404, 'Hire Creator not found');
  }
  if (existHireCreator.status !== 'approved') {
    throw new AppError(404, 'Hire Creator is not approved!');
  }

  if (payload.price <= 0) {
    throw new AppError(400, 'Price must be greater than zero!');
  }

  const videoCount: any = await Subscription.findById(
    existHireCreator.subscriptionId,
  );
  console.log('videoCount', videoCount);
  if (!videoCount) {
    throw new AppError(404, 'Subscription not found for this Hire Creator');
  }

  const creatorData = await Promise.all(
    payload.creatorsIds.map(async (creatorId: string) => {
      const existCreator = await Creator.findById(creatorId);
      if (!existCreator) {
        throw new AppError(404, 'Creator not found');
      }

      const existingAssignTaskCreator = await AssignTaskCreator.findOne({
        creatorId: existCreator._id,
        hireCreatorId: existHireCreator._id,
      });

      if (!existingAssignTaskCreator) {
        return {
          creatorId: existCreator._id,
          creatorUserId: existCreator.userId,
          price: payload.price,
          hireCreatorId: existHireCreator._id,
          hireCreatorUserId: existHireCreator.userId,
          videoCount:
            existHireCreator.takeVideoCount !== 0
              ? existHireCreator.takeVideoCount
              : videoCount.videoCount,
        };
      }

      return null;
    }),
  );
  console.log('creatorData', creatorData);
  const validCreatorData = creatorData.filter((data) => data !== null);
  console.log('validCreatorData', validCreatorData);

  if (validCreatorData.length === 0) {
    throw new AppError(
      404,
      'No new tasks to assign, all creators are already assigned',
    );
  }

  const result = await AssignTaskCreator.insertMany(validCreatorData);

  if (!result) {
    throw new AppError(403, 'AssignTaskCreator creation failed!');
  }

  return result;
};

const getAllAssignTaskCreatorQuery = async (query: Record<string, unknown>) => {
  const AssignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({})
      // .populate('creatorId')
      // .populate('creatorUserId')
      // .populate('hireCreatorId')
      .populate({
        path: 'hireCreatorUserId',
        select:
          'fullName email address phone',
      }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AssignTaskCreatorQuery.modelQuery;

  const meta = await AssignTaskCreatorQuery.countTotal();
  return { meta, result };
};

const getAllAssignTaskCreatorOfUserQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const updateUserId =
    user.role === 'creator' ? 'creatorUserId' : 'hireCreatorUserId';

  const assignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({ [updateUserId]: userId })
      .populate('creatorId')
      .populate('creatorUserId')
      .populate('hireCreatorId')
      .populate('hireCreatorUserId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await assignTaskCreatorQuery.modelQuery;

  const meta = await assignTaskCreatorQuery.countTotal();
  return { meta, result };
};

const getSingleAssignTaskCreatorQuery = async (id: string) => {
  const assignTaskCreator: any = await AssignTaskCreator.findById(id)
    .populate('creatorId')
    .populate('creatorUserId')
    .populate('hireCreatorId')
    .populate('hireCreatorUserId');
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }
  return assignTaskCreator;
};


const getSingleHireCreatorToAssignTaskCreator = async (id: string) => {
    if (!id) {
        throw new AppError(400, 'Invalid input parameters');
    }

  const assignTaskCreator: any = await AssignTaskCreator.findOne({
    hireCreatorId: id,
    status: { $nin: ['cancel', 'pending', 'request_approved'] },
  })
    .populate('creatorId')
    .populate('creatorUserId')
    .populate('hireCreatorId')
    .populate('hireCreatorUserId');
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }
  return assignTaskCreator;
};

const singleAssignTaskCreatorApprovedCancelQuery = async (
  id: string,
  status: any,
    userId: string,
) => {
  console.log('id', id);
  console.log('updated status', status);
  const assignTaskCreator: any = await AssignTaskCreator.findById(id);
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator is not found!');
  }
  if (assignTaskCreator.status !== 'pending') {
    throw new AppError(404, 'AssignTaskCreator is not pending!');
  }

  if (assignTaskCreator.creatorUserId.toString() !== userId.toString()) {
    throw new AppError(403, 'You are not authorized to approve or cancel this task creator!');
  }

  const creator = await Creator.findOne({ userId });

  if (!creator) {
    throw new AppError(404, 'Creator not found!');
  }


  if (status === 'request_approved') {

    // const creatorPaypalEmailValidation = creator.paypalEmail;
    // if (!creatorPaypalEmailValidation) {
    //   throw new AppError(403, 'Creator paypal email not found!');
    // }


    // const validEmal = paypalClient.







    if (assignTaskCreator.status === 'request_approved') {
      throw new AppError(403, 'AssignTaskCreator is already approved!');
    }
    const result = await AssignTaskCreator.findByIdAndUpdate(
      id,
      { status: 'request_approved' },
      {
        new: true,
      },
    );

    if (!result) {
      throw new AppError(403, 'updated faild!!');
    }

    return result;
  } else {
    if (assignTaskCreator.status === 'cancel') {
      throw new AppError(403, 'AssignTaskCreator is already cancel!');
    }

    const result = await AssignTaskCreator.findByIdAndDelete(id);

    if (!result) {
      throw new AppError(403, 'AssignTaskCreator updated faild!!');
    }

    return result;
  }
};

const singleAssignTaskCreatorApprovedByAdmin = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('id', id);
    const assignTaskCreatorProduct: any =
      await AssignTaskCreator.findById(id).session(session);
    if (!assignTaskCreatorProduct) {
      throw new AppError(404, 'AssignTaskCreator is not found!');
    }

    if (assignTaskCreatorProduct.status !== 'request_approved') {
      throw new AppError(404, 'AssignTaskCreator is not approved yet!');
    }

    if (assignTaskCreatorProduct.status === 'approved') {
      throw new AppError(404, 'AssignTaskCreator is already approved!');
    }

    const hireCreatorUpdate = await HireCreator.findByIdAndUpdate(
      assignTaskCreatorProduct.hireCreatorId,
      { status: 'ongoing', creatorId: assignTaskCreatorProduct.creatorId, creatorUserId: assignTaskCreatorProduct.creatorUserId, creatorPrice: assignTaskCreatorProduct.price },
      { new: true, session },
    );
    if (!hireCreatorUpdate) {
      throw new AppError(403, 'HireCreator update failed!');
    }

   const allDeleteAssignTaskCreator = await AssignTaskCreator.deleteMany({
     hireCreatorId: assignTaskCreatorProduct.hireCreatorId
   })

    

    await session.commitTransaction();
    session.endSession();

    return hireCreatorUpdate;
  } catch (error:any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong!',
    );
  }
};
  

// const assignTaskCreatorUploadVideosByCreator = async (
//   id: string,
//   userId: string,
//   files: any,
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!id || !userId) {
//       throw new AppError(400, 'Invalid input parameters');
//     }

//     const assignTaskCreatorProduct: any =
//       await AssignTaskCreator.findById(id).session(session);
//     if (!assignTaskCreatorProduct) {
//       throw new AppError(404, 'AssignTaskCreator is not found!!');
//     }

//     if (
//       (assignTaskCreatorProduct.status !== 'approved' &&
//         assignTaskCreatorProduct.status !== 'revision') ||
//       assignTaskCreatorProduct.creatorUserId.toString() !== userId.toString()
//     ) {
//       throw new AppError(
//         404,
//         'AssignTaskCreator is not approved or revision, you are not the creator!',
//       );
//     }

//     if (!files || files.uploadVideos.length === 0) {
//       throw new AppError(400, 'No video files uploaded');
//     }

//     if (files.uploadVideos.length > assignTaskCreatorProduct.videoCount) {
//       throw new AppError(
//         400,
//         `You can only upload ${assignTaskCreatorProduct.videoCount} videos`,
//       );
//     }

//     if (files.uploadVideos && files.uploadVideos.length > 0) {
//       const videos: any = await uploadManyToS3(
//         files.uploadVideos,
//         'uploadVideos/',
//       );

//       if (!videos || videos.length === 0) {
//         throw new AppError(400, 'Video upload failed');
//       }

//       const updateAssignTaskUploadVideos =
//         await AssignTaskCreator.findByIdAndUpdate(
//           id,
//           { uploadedFiles: videos, status: 'completed' },
//           { new: true, session },
//         );

//       const updateHireCreator = await HireCreator.findByIdAndUpdate(
//         assignTaskCreatorProduct.hireCreatorId,
//         { status: 'completed' },
//         { new: true, session },
//       );

//       if (!updateAssignTaskUploadVideos || !updateHireCreator) {
//         throw new AppError(
//           403,
//           'Failed to update AssignTaskCreator or HireCreator',
//         );
//       }

//       const allVideoPaths = files.uploadVideos.map(
//         (video: any) => `${video.path}`,
//       );
//       await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

//       await session.commitTransaction();
//       session.endSession();

//       return updateAssignTaskUploadVideos;
//     }
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     try {
//       const allVideoPaths = files?.uploadVideos?.map(
//         (video: any) => `${video.path}`,
//       );
//       if (allVideoPaths) {
//         await Promise.all(allVideoPaths.map((path: any) => unlink(path)));
//       }
//     } catch (fsError) {
//       console.error('Error accessing or deleting the video files:', fsError);
//     }

//     throw new AppError(
//       error.statusCode || 500,
//       error.message || 'An error occurred',
//     );
//   }
// };
  


// const assignTaskRevisionByUser = async (
//   id: string,
//   userId: string,
//   payload: any,
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!payload.revisionText && !payload.status) {
//       throw new AppError(400, 'Invalid input parameters: revisionText or status is required');
//     }

//     if (!id || !userId) {
//       throw new AppError(400, 'Invalid input parameters');
//     }

//     if (payload.revisionText) {
//       const assignTaskCreator: any =
//         await AssignTaskCreator.findById(id).session(session);
//       if (!assignTaskCreator) {
//         throw new AppError(404, 'AssignTaskCreator is not found!!');
//       }
//       if (assignTaskCreator.status === 'delivered') {
//         throw new AppError(404, 'AssignTaskCreator is already delivered!!');
//       }

//       if (
//         assignTaskCreator.status !== 'completed' ||
//         assignTaskCreator.hireCreatorUserId.toString() !== userId.toString()
//       ) {
//         throw new AppError(
//           404,
//           'AssignTaskCreator is not completed, you are not the brand creator!!',
//         );
//       }
//       const result = await AssignTaskCreator.findByIdAndUpdate(
//         id,
//         { status: 'revision', isScript: payload.revisionText },
//         { new: true, session },
//       );
//       if (!result) {
//         throw new AppError(403, 'AssignTaskCreator update failed!!');
//       }

//       const updateHireCreator = await HireCreator.findByIdAndUpdate(
//         assignTaskCreator.hireCreatorId,
//         { status: 'revision' },
//         { new: true, session },
//       );

//       if (!updateHireCreator) {
//         throw new AppError(403, 'HireCreator update failed!!');
//       }
//       await session.commitTransaction();
//       session.endSession();

//       return result;
//     } else if (payload.status && payload.status === 'delivered') {
//         const assignTaskCreator: any =
//             await AssignTaskCreator.findById(id).session(session);
//         if (!assignTaskCreator) {
//             throw new AppError(404, 'AssignTaskCreator is not found!!');
//         }
    
//         if (
//           assignTaskCreator.status !== 'completed' ||
//           assignTaskCreator.hireCreatorUserId.toString() !== userId.toString()
//         ) {
//           throw new AppError(
//             404,
//             'AssignTaskCreator is not revision, you are not the brand creator!!',
//           );
//         }
//         const result = await AssignTaskCreator.findByIdAndUpdate(
//             id,
//             { status: 'delivered' },
//             { new: true, session },
//         );
//         if (!result) {
//             throw new AppError(403, 'AssignTaskCreator update failed!!');
//         }
    
//         const updateHireCreator:any = await HireCreator.findByIdAndUpdate(
//             assignTaskCreator.hireCreatorId,
//             { status: 'delivered' },
//             { new: true, session },
//         );

//         const subscriptioinUpdate = await Subscription.findOneAndUpdate(
//           { _id: updateHireCreator.subscriptionId },
//           { status: 'completed' },
//           { new: true, session },
//         );
    
//         if (!updateHireCreator) {
//             throw new AppError(403, 'Hire Creator update failed!!');
//         }
//         await session.commitTransaction();
//         session.endSession();
    
//         return result;
//     }
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     throw new AppError(
//       error.statusCode || 500,
//       error.message || 'Something went wrong!',
//     );
//   }
// };


// const assignTaskCreatorReSubmitUploadVideosByCreator = async (
//   id: string,
//   userId: string,
//   files: any,
// ) => {

//   if (!id || !userId) {
//     throw new AppError(400, 'Invalid input parameters');
//   }
//   const assignTaskCreatorProduct: any = await AssignTaskCreator.findById(id);
//   if (!assignTaskCreatorProduct) {
//     throw new AppError(404, 'AssignTaskCreator is not found!!');
//   }

//   try {
//     if (
//       assignTaskCreatorProduct.status !== 'revision' ||
//       assignTaskCreatorProduct.creatorUserId.toString() !== userId.toString()
//     ) {
//       throw new AppError(
//         404,
//         'AssignTaskCreator is not approved, you are not the creator!',
//       );
//     }

//     if (!files || files.uploadVideos.length === 0) {
//       throw new AppError(400, 'No video files uploaded');
//     }


//     if (files.uploadVideos.length > assignTaskCreatorProduct.videoCount) {
//       throw new AppError(
//         400,
//         `You can only upload ${assignTaskCreatorProduct.videoCount} videos`,
//       );
//     }

//     console.log('assignTaskCreatorProduct.uploadedFiles', assignTaskCreatorProduct.uploadedFiles);

//      const keys = assignTaskCreatorProduct.uploadedFiles.map(
//        (key: any) => key.url.split('amazonaws.com/')[1],
//      );
//       console.log('keys', keys);
    
//       const deleteImage: any = await deleteManyFromS3(keys);
//       console.log('deleteImage', deleteImage);


//       if (deleteImage && files.uploadVideos && files.uploadVideos.length > 0) {
//         const videos: any = await uploadManyToS3(
//           files.uploadVideos,
//           'uploadVideos/',
//         );

//         if (!videos || videos.length === 0) {
//           throw new AppError(400, 'Video upload failed');
//         }

//         const updateAssignTaskUploadVideos =
//           await AssignTaskCreator.findByIdAndUpdate(
//             id,
//             { uploadedFiles: videos, status: 'completed' },
//             { new: true },
//           );

//         if (updateAssignTaskUploadVideos) {
//           const allVideo = files.uploadVideos.map(
//             (video: any) => `${video.path}`,
//           );
//           await Promise.all(allVideo.map((path: any) => unlink(path)));
//         }

//         return updateAssignTaskUploadVideos;
//       }

    
//   } catch (error:any) {
//     try {
//       const allVideo = files?.uploadVideos?.map(
//         (video: any) => `${video.path}`,
//       );
//       await Promise.all(allVideo?.map((path: any) => unlink(path)));
//     } catch (fsError) {
//       console.error('Error accessing or deleting the image file:', fsError);
//         throw new AppError(
//             error.statusCode || 500,
//             error.message || 'An error occurred while processing the request'
//         );
//     }
//     throw error;
//   }
// };

const deletedAssignTaskCreatorQuery = async (id: string, userId: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const assignTaskCreator = await AssignTaskCreator.findOne({
    _id: id,
    creatorUserId: userId,
  });

  if (!assignTaskCreator) {
    throw new AppError(
      404,
      'AssignTaskCreator Not Found or Unauthorized Access',
    );
  }

  if (assignTaskCreator.status !== 'cancel') {
    throw new AppError(
      404,
      'AssignTaskCreator is not cancel, cannot be deleted',
    );
  }

  const result = await AssignTaskCreator.deleteOne({
    _id: id,
    creatorUserId: userId,
  });
  if (result.deletedCount === 0) {
    throw new AppError(
      404,
      'AssignTaskCreator not deleted or Result Not Found',
    );
  }

  return result;
};

export const assignTaskCreatorService = {
  createAssignTaskCreator,
  getAllAssignTaskCreatorQuery,
  getAllAssignTaskCreatorOfUserQuery,
  getSingleAssignTaskCreatorQuery,
  getSingleHireCreatorToAssignTaskCreator,
  singleAssignTaskCreatorApprovedCancelQuery,
  singleAssignTaskCreatorApprovedByAdmin,
  // assignTaskCreatorUploadVideosByCreator,
  // assignTaskRevisionByUser,
  // assignTaskCreatorReSubmitUploadVideosByCreator,
  deletedAssignTaskCreatorQuery,
};
