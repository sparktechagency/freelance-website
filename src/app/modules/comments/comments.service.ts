import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TComments } from './comments.interface';
import Comments from './comments.model';
import { User } from '../user/user.models';
import mongoose, { Types } from 'mongoose';

const createCommentOrReply = async (payload: {
  commentId?: string;
  replyId?: string;
  userId: string;
  doctorId: string;
  message: string;
  isReply?: boolean;
  isReplyToReply?: boolean;
}) => {
  console.log('Payload received: ', payload);

  const doctorExist = await User.findById(payload.doctorId);
  if (!doctorExist) {
    throw new AppError(404, 'Doctor not found!');
  }
  if (doctorExist.role !== 'doctor') {
    throw new AppError(404, 'The specified user is not a doctor!');
  }

  if (!payload.isReply && !payload.isReplyToReply) {
    const newComment = new Comments({
      doctorId: payload.doctorId,
      userId: payload.userId,
      message: payload.message,
      likes: [],
      commentsReply: [],
    });

    const savedComment = await newComment.save();

    if (!savedComment) {
      throw new AppError(500, 'Failed to create comment');
    }
    return savedComment;
  }

  if (payload.isReply && !payload.isReplyToReply) {
    const existingComment = await Comments.findById(payload.commentId);
    if (!existingComment) {
      throw new AppError(404, 'Parent comment not found!');
    }

    const userObjectId = new Types.ObjectId(payload.userId);

    const replyComment = new Comments({
      userId: userObjectId,
      doctorId: existingComment.doctorId,
      message: payload.message,
      likes: [],
      commentsReply: [],
    });

    const savedReplyComment = await replyComment.save();

    if (!savedReplyComment) {
      throw new AppError(500, 'Failed to create reply comment');
    }

    existingComment.commentsReply.push(savedReplyComment._id);
    await Comments.findByIdAndUpdate(payload.commentId, {
      $set: { commentsReply: existingComment.commentsReply },
    });

    return savedReplyComment;
  }

  if (payload.isReplyToReply) {
    const parentComment = await Comments.findById(payload.commentId);
    if (!parentComment) {
      throw new AppError(404, 'Parent comment not found!');
    }

    const parentReply = await Comments.findById(payload.replyId);
    if (!parentReply) {
      throw new AppError(404, 'Reply comment not found!');
    }

    const userObjectId = new Types.ObjectId(payload.userId);

    const replyToReply = new Comments({
      userId: userObjectId,
      doctorId: parentComment.doctorId,
      message: payload.message,
      likes: [],
      commentsReply: [],
    });

    const savedReplyToReply = await replyToReply.save();

    if (!savedReplyToReply) {
      throw new AppError(500, 'Failed to create reply to reply');
    }

    parentReply.commentsReply.push(savedReplyToReply._id);
    await Comments.findByIdAndUpdate(payload.replyId, {
      $set: { commentsReply: parentReply.commentsReply },
    });

    return savedReplyToReply;
  }
};

const handleLikeForComments = async (payload: {
  commentId: string; 
  replyId?: string; 
  replyToReplyId?: string; 
  userId: string;
}) => {
  console.log('Like/Unlike payload:', payload);

  let comment;

  if (payload.replyToReplyId) {
    comment = await Comments.findById(payload.replyToReplyId);
    if (!comment) {
      throw new AppError(404, 'Reply to reply comment not found!');
    }
  } else if (payload.replyId) {
    comment = await Comments.findById(payload.replyId);
    if (!comment) {
      throw new AppError(404, 'Reply comment not found!');
    }
  } else {
    comment = await Comments.findById(payload.commentId);
    if (!comment) {
      throw new AppError(404, 'Comment not found!');
    }
  }

  const userObjectId = new Types.ObjectId(payload.userId);
  const isAlreadyLiked = comment.likes.includes(userObjectId);

  if (isAlreadyLiked) {
    await Comments.updateOne(
      { _id: comment._id },
      { $pull: { likes: payload.userId } },
    );
    console.log(`User ${payload.userId} removed their like from the comment.`);
  } else {
    await Comments.updateOne(
      { _id: comment._id },
      { $push: { likes: payload.userId } },
    );
    console.log(`User ${payload.userId} liked the comment.`);
  }

  const updatedComment = await Comments.findById(comment._id);

  if (!updatedComment) {
    throw new AppError(
      500,
      'Failed to fetch updated comment after like operation.',
    );
  }

  return updatedComment;
};


const getAllCommentByDoctorQuery = async (id:string) => {

  const result = await Comments.find({ doctorId: id })
    .populate({
      path: 'doctorId',
      select: 'fullName profile', 
    })
    .populate({
      path: 'userId',
      select: 'fullName profile', 
    })
    .populate({
      path: 'commentsReply', 
      select: 'message userId likes commentsReply',
      populate: [
        {
          path: 'userId', 
          select: 'fullName profile',
        },
        {
          path: 'commentsReply', 
          select: 'message userId likes commentsReply',
          populate: [
            {
              path: 'userId', 
              select: 'fullName profile',
            },
            {
              path: 'commentsReply', 
              select: 'message userId',
              populate: [
                {
                  path: 'userId', 
                  select: 'fullName profile',
                },
              ],
            },
          ],
        },
      ],
    });

  console.log('result', result);


  console.log('result', result);
  if (!result || result.length === 0) {
    throw new AppError(403, 'No comments found for this doctor!');
  }



  return result;
  
};

const getSingleCommentQuery = async (id: string) => {
  const comment: any = await Comments.findById(id);
  if (!comment) {
    throw new AppError(404, 'Comment Not Found!!');
  }
  return comment;
};

const updateSingleCommentQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const comment: any = await Comments.findById(id);
  if (!comment) {
    throw new AppError(404, 'Comment is not found!');
  }

  const result = await Comments.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Comment updated faild!!');
  }

  return result;
};

const deletedCommentQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const comment = await Comments.findById(id);
  if (!comment) {
    throw new AppError(404, 'Comment Not Found!!');
  }

  const result = await Comments.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Comment Result Not Found !');
  }

  return result;
};

export const commentService = {
  createCommentOrReply,
  handleLikeForComments,
  getAllCommentByDoctorQuery,
  getSingleCommentQuery,
  updateSingleCommentQuery,
  deletedCommentQuery,
};
