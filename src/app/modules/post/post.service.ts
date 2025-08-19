import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import FavoriteProduct from '../favorite/favorite.model';
import { TPost } from './post.interface';
import Post from './post.model';
import { Types } from 'mongoose';

const createPost = async ( payload: TPost) => {
  try {
    // if (files.image && files.image.length > 0) {
    //   const image: any = await uploadToS3({
    //     file: files.image[0],
    //     fileName: files.image[0].originalname,
    //     folder: 'AcreatePosts/',
    //   });
    //   payload.image = image;
    // }

    // if (files.image && files.image.length > 0) {
    //   const image: any = files.image[0].path.replace(/^public[\\/]/, '');
    //   payload.image = image;
    // }

    const result = await Post.create(payload);

    // if (result) {
    //   const fileDeletePath = `${files.image[0].path}`;
    //   await unlink(fileDeletePath);
    // }
    return result;
  } catch (error) {
    // try {
    //   const fileDeletePath = `${files.image[0].path}`;
    //   await unlink(fileDeletePath);
    // } catch (fsError) {
    //   console.error('Error accessing or deleting the image file:', fsError);
    // }
    throw error;
  }
};


const createPostLike = async (postId: string, userId: string) => {

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, 'Post not found!');
  }

  
    const userObjectId = new Types.ObjectId(userId);
    const isAlreadyLiked = post.likes.includes(userObjectId);
  
    if (isAlreadyLiked) {
      await Post.updateOne(
        { _id: post._id },
        { $pull: { likes: userId } },
      );
       await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      console.log(`User ${userId} removed their like from the comment.`);
    } else {
      await Post.updateOne(
        { _id: post._id },
        { $push: { likes: userId } },
      );
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      console.log(`User ${userId} liked the comment.`);
    }
};


const createPostHighlight = async (postId: string, doctorId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, 'Post not found!');
  }

  const userObjectId = new Types.ObjectId(doctorId);
  const isAlreadyHighlight = post.highlights.includes(userObjectId);

  if (isAlreadyHighlight) {
    await Post.updateOne(
      { _id: post._id },
      { $pull: { highlights: doctorId } },
    );
    await Post.findByIdAndUpdate(postId, { $inc: { highlightsCount: -1 } });
    console.log(`User ${doctorId} removed their like from the comment.`);
  } else {
    await Post.updateOne(
      { _id: post._id },
      { $push: { highlights: doctorId } },
    );
    await Post.findByIdAndUpdate(postId, { $inc: { highlightsCount: 1 } });
    console.log(`User ${doctorId} liked the comment.`);
  }
};

const getAllPostQuery = async (
  query: Record<string, unknown>,
  // userId: string,
) => {
  console.log('query=', query);
Object.keys(query).forEach((key) => {
  if (query[key] === 'true') query[key] = true;
  if (query[key] === 'false') query[key] = false;
});
  // query = JSON.parse(query.recent);
  console.log('query=end', query);

  let filter: Record<string, unknown> = { isDeleted: false };
  if (query.recent) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    filter.createdAt = { $gte: startOfToday };
     delete query.recent;
  } else if (query.highlight) {
    filter.highlightsCount = { $gt: 0 };
     delete query.highlight;
  } else if (query.popular) {
    query.limit = 10; 
    query.sort = '-likesCount -highlightsCount -commentsCount';
    delete query.popular;
  }

  console.log('filter=', filter);
  const AcreatePostQuery = new QueryBuilder(
    Post.find(filter).populate({
      path: 'userId',
      select: 'profile fullName email role address',
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AcreatePostQuery.modelQuery;
  const meta = await AcreatePostQuery.countTotal();

  return { meta, result };

  // if(query.recent){
  //  const AcreatePostQuery = new QueryBuilder(
  //    Post.find({ isDeleted: false, createdAt: { $gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) }  }).populate({
  //      path: 'userId',
  //      select: 'profile fullName email role address',
  //    }),
  //    query,
  //  )
  //    .search([])
  //    .filter()
  //    .sort()
  //    .paginate()
  //    .fields();

  //  const result = await AcreatePostQuery.modelQuery;

  //  const meta = await AcreatePostQuery.countTotal();
  //  return { meta, result };

  // }else if (query.highlight) {
  //   const AcreatePostQuery = new QueryBuilder(
  //     Post.find({ isDeleted: false, highlightsCount: { $gt: 0 } }).populate({
  //       path: 'userId',
  //       select: 'profile fullName email role address',
  //     }),
  //     query,
  //   )
  //     .search([])
  //     .filter()
  //     .sort()
  //     .paginate()
  //     .fields();

  //   const result = await AcreatePostQuery.modelQuery;

  //   const meta = await AcreatePostQuery.countTotal();
  //   return { meta, result };
  // }else if(query.popular){
  //   query.sort = '-likesCount';
  //   query.sort = '-highlightsCount';
  //   query.sort = '-commentsCount';

  //   const AcreatePostQuery = new QueryBuilder(
  //     Post.find({ isDeleted: false }).populate({
  //       path: 'userId',
  //       select: 'profile fullName email role address',
  //     }),
  //     query,
  //   )
  //     .search([])
  //     .filter()
  //     .sort()
  //     .paginate()
  //     .fields();

  //   const result = await AcreatePostQuery.modelQuery;

  //   const meta = await AcreatePostQuery.countTotal();
  //   return { meta, result };

  // }else{
  //   const AcreatePostQuery = new QueryBuilder(
  //     Post.find({ isDeleted: false }).populate({
  //       path: 'userId',
  //       select: 'profile fullName email role address',
  //     }),
  //     query,
  //   )
  //     .search([])
  //     .filter()
  //     .sort()
  //     .paginate()
  //     .fields();

  //   const result = await AcreatePostQuery.modelQuery;

  //   const meta = await AcreatePostQuery.countTotal();
  //   return { meta, result };

  // }

  
};

const getSinglePostQuery = async (id: string, ) => {
  const existingPost: any = await Post.findOne({
    _id: id,
    isDeleted: false,
  }).populate({
    path: 'userId',
    select: 'profile fullName email role address',
  });
  if (!existingPost) {
    throw new AppError(404, 'AcreatePost not found!');
  }

  console.log('existingPost=', existingPost);

  

  return existingPost;
};

const updateSinglePostQuery = async (
  id: string,
  // files: any,
  payload: any,
) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing AcreatePost by ID
    const existingAcreatePost: any = await Post.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!existingAcreatePost) {
      throw new AppError(404, 'AcreatePost not found!');
    }

    // if (files?.image && files?.image.length > 0) {
    //   // const image: any = await uploadToS3({
    //   //   file: files.image[0],
    //   //   fileName: files.image[0].originalname,
    //   //   folder: 'AcreatePosts/',
    //   // });
    //   //  payload.image = image;

    //   const image: any = files.image[0].path.replace(/^public[\\/]/, '');
    //   payload.image = image;

    //   const result = await Post.findByIdAndUpdate(id, payload, {
    //     new: true,
    //   });
    //   // if (result) {
    //   //   const fileDeletePath = `${files.image[0].path}`;
    //   //   await unlink(fileDeletePath);
    //   // }

    //   // const key = existingAcreatePost.image.split('amazonaws.com/')[1];

    //   // const deleteImage: any = await deleteFromS3(key);
    //   // console.log('deleteImage', deleteImage);
    //   // if (!deleteImage) {
    //   //   throw new AppError(404, 'Blog Image Deleted File !');
    //   // }

    //   return result;
    // } else {
    //   const result = await Post.findByIdAndUpdate(id, payload, {
    //     new: true,
    //   });
    //   return result;
    // }

    const result = await Post.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return result;
  } catch (error) {
    // try {
    //   const fileDeletePath = `${files.image[0].path}`;
    //   await unlink(fileDeletePath);
    // } catch (fsError) {
    //   console.error('Error accessing or deleting the image file:', fsError);
    // }
    throw error;
  }
};

const deletedPostQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const existingPost: any = await Post.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingPost) {
    throw new AppError(404, 'Post not found!');
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'AcreatePost Result Not Found !');
  }

  return result;
};

export const postService = {
  createPost,
  createPostLike,
  createPostHighlight,
  getAllPostQuery,
  getSinglePostQuery,
  updateSinglePostQuery,
  deletedPostQuery,
};
