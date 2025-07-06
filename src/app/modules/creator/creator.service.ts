import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCreator } from './creator.interface';
import Creator from './creator.model';
import { deleteFromS3, deleteManyFromS3, uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { access, unlink } from 'fs/promises';
import { User } from '../user/user.models';
import mongoose from 'mongoose';
import { populate } from 'dotenv';
import { imageUrlGenarate } from '../../utils/imageUrl';

const createCreator = async (files: any, payload: TCreator) => {
  const session = await mongoose.startSession(); 
  session.startTransaction(); 

  try {
    console.log('Creator payload=', payload);
    console.log('Creator files=', files);

    if(!payload.email || !payload.password || !payload.fullName || !files.profile){
      throw new AppError(
        403,
        'Email, Password, Full Name, profile is required',
      );
    }

    if (!files) {
      throw new AppError(403, 'At least one File is required');
    }

    const existCreator = await Creator.findOne({ email: payload.email });
    if (existCreator) {
      throw new AppError(403, 'Creator already exist');
    } 

    // buffer convert

    if (files.introductionvideo && files.introductionvideo.length > 0) {
      const introductionVideo: any = await uploadToS3({
        file: files.introductionvideo[0],
        fileName: files.introductionvideo[0].originalname,
        folder: 'videos/',
      });
      payload.introductionvideo = introductionVideo;
    }

    if (files.ugcExampleVideo && files.ugcExampleVideo.length > 0) {
      const ugcExampleVideo: any = await uploadManyToS3(files.ugcExampleVideo, 'videos/');
      payload.ugcExampleVideo = ugcExampleVideo;
    }

    if (files.profile && files.profile.length > 0) {
      const image = files.profile[0].path.replace(/^public[\\/]/, '');
      payload.profile = imageUrlGenarate(image);
    }

    console.log('payload', payload);

    const userData = {
      password: payload.password,
      email: payload.email,
      fullName: payload.fullName,
      role: 'creator',
      profile: payload.profile,
    };

    const user = await User.create([userData], { session }); 
    payload.userId = new mongoose.Types.ObjectId(user[0]._id);
    const result = await Creator.create([payload], { session }); 

    

    if (result) {
      const fileDeletePath = `${files.introductionvideo[0].path}`;
      await unlink(fileDeletePath);
      const allVideo = files.ugcExampleVideo.map(
        (video: any) => `${video.path}`,
      );
      await Promise.all(allVideo.map((path: any) => unlink(path)));
    }

    await session.commitTransaction();

    return result[0];
  } catch (error : any) {
    console.log('error----', error);
    const fileDeletePath = `${files.introductionvideo[0].path}`;
    await unlink(fileDeletePath);
    const profileDeletePath = `${files.profile[0].path}`;
    await unlink(profileDeletePath);

    const allVideo = files.ugcExampleVideo.map((video: any) => `${video.path}`);
    await Promise.all(allVideo.map((path: any) => unlink(path)));

    const key = `videos/${files.introductionvideo[0].originalname}`; 
    await deleteFromS3(key);

    await Promise.all(
      files.ugcExampleVideo.map((video: any) => { 
        const videoKey = `videos/${video.originalname}`;
        return deleteFromS3(videoKey);
      }),
    );

    throw error;
  
  } finally {
    session.endSession();
  }
};


const getAllCreatorQuery = async (query: Record<string, unknown>) => {
  const CreatorQuery = new QueryBuilder(
    Creator.find().populate({path:'userId', select:"profile"}).select(
      'accountHolderName phone email country status',
    ),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CreatorQuery.modelQuery;

  const meta = await CreatorQuery.countTotal();
  return { meta, result };
};
const getCreatorMeQuery = async (userId: string) => {
  const result = await Creator.find({ userId });
  return result;
};

const getSingleCreatorQuery = async (id: string) => {
  const creator: any = await Creator.findById(id).populate({
    path: 'userId',
    select: 'profile',
  });
  if (!creator) {
    throw new AppError(404, 'Creator Not Found!!');
  }
  return creator;
};


const updateSingleCreatorQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const creatorProduct: any = await Creator.findById(id);
  if (!creatorProduct) {
    throw new AppError(404, 'Creator is not found!');
  }

  const result = await Creator.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Creator updated faild!!');
  }

  return result;
};


const approvedCancelSingleCreator = async (id: string, status: string) => {
  console.log('id', id);
  console.log('updated status', status);
  const creator: any = await Creator.findById(id);
  if (!creator) {
    throw new AppError(404, 'Creator is not found!');
  }
  if (creator.status === 'approved') {
    throw new AppError(404, 'Creator is already approved!');
  }
  const newStatus = status === 'approved' ? 'approved' : 'cancel';
  const result = await Creator.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true },
  );

  if (!result) {
    throw new AppError(403, 'Creator updated faild!!');
  }

  return result;
};

const deletedCreatorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const creator = await Creator.findById(id);
  if (!creator) {
    throw new AppError(404, 'Creator Not Found!!');
  }

  const result = await Creator.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Creator Result Not Found !');
  }

  return result;
};

export const creatorService = {
  createCreator,
  getAllCreatorQuery,
  getCreatorMeQuery,
  getSingleCreatorQuery,
  updateSingleCreatorQuery,
  approvedCancelSingleCreator,
  deletedCreatorQuery,
};
