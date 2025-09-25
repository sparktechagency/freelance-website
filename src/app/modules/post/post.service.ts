import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import FavoriteProduct from '../favorite/favorite.model';
import { TPost } from './post.interface';
import Post from './post.model';
import { Types } from 'mongoose';

const createPost = async (files: any, payload: TPost) => {
  try {
    

    if (files.image && files.image.length > 0) {
      const image: any = files.image[0].path.replace(/^public[\\/]/, '');
      payload.image = image;
    }

    const result = await Post.create(payload);

    // if (result) {
    //   const fileDeletePath = `${files.image[0].path}`;
    //   await unlink(fileDeletePath);
    // }
    return result;
  } catch (error) {
    try {
      const fileDeletePath = `${files.image[0].path}`;
      await unlink(fileDeletePath);
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};


// const createPostLike = async (postId: string, userId: string) => {

//   const post = await Post.findById(postId);

//   if (!post) {
//     throw new AppError(404, 'Post not found!');
//   }

  
//     const userObjectId = new Types.ObjectId(userId);
//     const isAlreadyLiked = post.likes.includes(userObjectId);
  
//     if (isAlreadyLiked) {
//       await Post.updateOne(
//         { _id: post._id },
//         { $pull: { likes: userId } },
//       );
//        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
//       console.log(`User ${userId} removed their like from the comment.`);
//     } else {
//       await Post.updateOne(
//         { _id: post._id },
//         { $push: { likes: userId } },
//       );
//       await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
//       console.log(`User ${userId} liked the comment.`);
//     }
// };


// const createPostHighlight = async (postId: string, doctorId: string) => {
//   const post = await Post.findById(postId);

//   if (!post) {
//     throw new AppError(404, 'Post not found!');
//   }

//   const userObjectId = new Types.ObjectId(doctorId);
//   const isAlreadyHighlight = post.highlights.includes(userObjectId);

//   if (isAlreadyHighlight) {
//     await Post.updateOne(
//       { _id: post._id },
//       { $pull: { highlights: doctorId } },
//     );
//     await Post.findByIdAndUpdate(postId, { $inc: { highlightsCount: -1 } });
//     console.log(`User ${doctorId} removed their like from the comment.`);
//   } else {
//     await Post.updateOne(
//       { _id: post._id },
//       { $push: { highlights: doctorId } },
//     );
//     await Post.findByIdAndUpdate(postId, { $inc: { highlightsCount: 1 } });
//     console.log(`User ${doctorId} liked the comment.`);
//   }
// };



const getAllPostQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  console.log('query=', query);


  const AcreatePostQuery = new QueryBuilder(
    Post.find({userId, isDeleted: false}).populate({
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
  files: any,
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

    if (files.image && files.image.length > 0) {
      const image: any = files.image[0].path.replace(/^public[\\/]/, '');
      payload.image = image;
    }

      const result = await Post.findByIdAndUpdate(id, payload, {
        new: true,
      });
     
   
    return result;
  } catch (error) {
    try {
      const fileDeletePath = `${files.image[0].path}`;
      await unlink(fileDeletePath);
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};

const deletedPostQuery = async (id: string, userId: string) => {
  console.log('dele');
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
  if (existingPost.userId.toString() !== userId) {
    throw new AppError(404, 'You are not authorized to delete this Post!');
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
  // createPostLike,
  // createPostHighlight,
  getAllPostQuery,
  getSinglePostQuery,
  updateSinglePostQuery,
  deletedPostQuery,
};
