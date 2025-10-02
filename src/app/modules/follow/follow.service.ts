import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TFollow } from './follow.interface';
import Follow from './follow.model';
import { User } from '../user/user.models';

const createFollow = async (userId: string, followerUserId: string) => {
  const payload = {
    userId,
    followerUserId,
  };

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const followerUser = await User.findById(followerUserId);
  if (!followerUser) {
    throw new AppError(404, 'followerUser not found');
  }

  const client = await Follow.findOne({ userId, followerUserId });

  if (client) {
    const result = await Follow.findOneAndDelete({ userId, followerUserId });
    if (result) {
      await User.updateOne(
        { _id: followerUserId },
        { $inc: { followers: -1 } },
      );
    }
    return result && 'Unfollow successfully!!';
  } else {
    const result = await Follow.create(payload);
    if (result) {
      await User.updateOne({ _id: followerUserId }, { $inc: { followers: 1 } });
    }
    return result && 'Follow successfully!!';
  }
};

const getAllFollowQuery = async (query: Record<string, unknown>) => {
  const FollowQuery = new QueryBuilder(Follow.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await FollowQuery.modelQuery;

  const meta = await FollowQuery.countTotal();
  return { meta, result };
};

const getSingleFollowQuery = async (id: string) => {
  const follow: any = await Follow.findById(id);
  if (!follow) {
    throw new AppError(404, 'Follow Not Found!!');
  }
  return follow;
};

const isFollow = async (followerUserId: string, userId: string) => {
  const followerUser = await User.findById(followerUserId);

  if (!followerUser) {
    throw new AppError(404, 'followerUser not found!!');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found!!');
  }

  const follow: any = await Follow.findOne({ followerUserId, userId });

  return follow ? 'true' : 'false';
};

const updateSingleFollowQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const followProduct: any = await Follow.findById(id);
  if (!followProduct) {
    throw new AppError(404, 'Follow is not found!');
  }

  const result = await Follow.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Follow updated faild!!');
  }

  return result;
};

const deletedFollowQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const follow = await Follow.findById(id);
  if (!follow) {
    throw new AppError(404, 'Follow Not Found!!');
  }

  const result = await Follow.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Follow Result Not Found !');
  }

  return result;
};

export const followService = {
  createFollow,
  getAllFollowQuery,
  getSingleFollowQuery,
  isFollow,
  updateSingleFollowQuery,
  deletedFollowQuery,
};
