import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TSubscription } from './subscription.interface';
import Subscription from './subscription.model';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import { unlink } from 'fs/promises';
import { User } from '../user/user.models';
import Package from '../package/package.model';
import { calculateEndDate } from './subcription.utils';
import mongoose from 'mongoose';
import { Payment } from '../payment/payment.model';
import e from 'express';
import { paymentService } from '../payment/payment.service';


const createSubscription = async (payload: any, session?: any) => {
  const createdSession = session || (await mongoose.startSession());
 
  try {
    createdSession.startTransaction();
    const user = await User.findById(payload.userId).session(createdSession);
    if (!user) throw new AppError(404, 'User not found!');

    const existingPackage = await Package.findById(payload.packageId).session(
      createdSession,
    );
    if (!existingPackage) throw new AppError(404, 'Service package not found!');

    if (
      ['1 month', '3 months', '6 months', '1 year'].includes(
        existingPackage.duration,
      )
    ) {
      const existingSubscription = await Subscription.findOne({
        userId: payload.userId,
        type: existingPackage.duration,
        isDeleted: false,
        status: ['running', 'completed'],
      }).session(createdSession);

      if (existingSubscription) {
        throw new AppError(
          400,
          'You already have a Subscription of this type! Please renew it.',
        );
      }

      const days = existingPackage.duration === '1 month' ? 30 : 365;
      payload.endDate = calculateEndDate(new Date(), days);
    } else {
      const runningSubscription = await Subscription.findOne({
        userId: payload.userId,
        isDeleted: false,
        endDate: { $gt: new Date() },
        $expr: { $lt: ['$takeMeetCount', '$meetCount'] },
      }).session(createdSession);

      if (runningSubscription) {
        throw new AppError(400, 'Your subscription is already running!');
      }
    }

    payload.price = existingPackage.price;
    payload.meetCount = existingPackage.meetCount;
    payload.meetDuration = existingPackage.meetDuration;
    payload.type = existingPackage.duration;

    const result = await Subscription.create([payload], {
      session: createdSession,
    });
    if (!result || result.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create subscription',
      );
    }

    const paymentData = {
      subscriptionId: result[0]._id,
      amount: existingPackage.price,
    };
  const url = await paymentService.createCheckout(payload.userId, paymentData);

    await createdSession.commitTransaction();
    return url;
  } catch (error) {
    await createdSession.abortTransaction();
    console.error('Error during subscription creation transaction:', error);
    throw error;
  } finally {
    createdSession.endSession(); // Always end the session
  }
};


const getAllMysubscriptionQuery = async (query: Record<string, unknown>, userId: string) => {
 
  if (query.running && query.running === 'subscription'){
    console.log('subscription');

    const result = await Subscription.findOne({
      userId: userId,
      isDeleted: false,
      endDate: { $gt: new Date() },
      type: ['monthly', 'yearly'],
      $expr: { $lt: ['$takeMeetCount', '$meetCount'] },
    })
      .populate('packageId')
      .populate('userId');

    // console.log('result==', result);

    return result;

  }
  else if(query.all && query.all === 'subscription'){
    console.log('all')
    delete query.all;

    const subscriptionQuery = new QueryBuilder(
      Subscription.find({
        userId: userId,
        isDeleted: false,
        type: ['monthly', 'yearly']
      }).populate('packageId').populate('userId'),
      query,
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await subscriptionQuery.modelQuery;
    console.log('result==', result);

    const meta = await subscriptionQuery.countTotal();
    return { meta, result };

  }else {
    const subscriptionQuery = new QueryBuilder(
      Subscription.find({
        userId: userId,
        isDeleted: false,
      })
        .populate('packageId')
        .populate('userId'),
      query,
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await subscriptionQuery.modelQuery;

    const meta = await subscriptionQuery.countTotal();
    return { meta, result };
  }

};

const getSingleSubscriptionQuery = async (id: string) => {
  const existingSubscription: any = await Subscription.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingSubscription) {
    throw new AppError(404, 'Subscription not found!!');
  }
  return existingSubscription;
};


const getSubscrptionExistSubscriptionQuery = async (userId: string) => {
  
  const existingPackage: any = await Subscription.findOne({
    type: 'one_time',
    userId: userId,
    isDeleted: false,
    status: 'pending',
  });
  const existingSubscription: any = await Subscription.findOne({
    type: ['monthly', 'yearly'],
    userId: userId,
    isDeleted: false,
    endDate: { $gt: new Date() },
    $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
  });


    if (existingPackage || existingSubscription) {
      // console.log('existingSubscription==', existingSubscription);
      // console.log('existingPackage==', existingPackage);

      return 'true';
    } else {
      return 'false';
    }



};

const updateSingleSubscriptionQuery = async (id: string, files: any, payload: any) => {
  
};

const deletedsubscriptionQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const existingSubscription: any = await Subscription.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingSubscription) {
    throw new AppError(404, 'Subscription not found!');
  }
 
  const result = await Subscription.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'Package Result Not Found !');
  }

  return result;
};


export const subscriptionService = {
  createSubscription,
  getAllMysubscriptionQuery,
  getSingleSubscriptionQuery,
  getSubscrptionExistSubscriptionQuery,
  updateSingleSubscriptionQuery,
  deletedsubscriptionQuery,
};
