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


const createSubscription = async (payload: any, session?: any) => {
  console.log('payload==subscription', payload);
  // const session = await mongoose.startSession();
  let createdSession = session || (await mongoose.startSession());
  if (!createdSession.inTransaction()) {
    createdSession.startTransaction();
  }

  try {
    const user = await User.findById(payload.userId).session(createdSession);
    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    const existingPackage = await Package.findById(payload.packageId).session(
      createdSession,
    );
    if (!existingPackage) {
      throw new AppError(404, 'This Service is not found!');
    }

    if (
      existingPackage.type === 'yearly' ||
      existingPackage.type === 'monthly'
    ) {
      const existingSubscription = await Subscription.findOne({
        userId: payload.userId,
        type: existingPackage.type,
        isDeleted: false,
      }).session(createdSession);

      if (existingSubscription) {
        throw new AppError(400, 'You already have a Subscription! Please renew it.');
      }

      payload.price = existingPackage.price;
      const days = existingPackage.type === 'monthly' ? 30 : 365;
      const generateEndDate = calculateEndDate(new Date(), days);
      payload.endDate = generateEndDate;
      payload.videoCount = existingPackage.videoCount;
      payload.type = existingPackage.type;
      // payload.status = 'running';
    } else {
      console.log('subscription service package==');
      const runningubscription = await Subscription.findOne({
        userId: payload.userId,
        isDeleted: false,
        endDate: { $gt: new Date() },
        $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
      }).session(createdSession);

      // if (runningubscription) {
      //   throw new AppError(400, 'Your Subscription is already running!');
      // }
      payload.price = existingPackage.price;
      payload.videoCount = existingPackage.videoCount;
      payload.type = existingPackage.type;
      // payload.status = 'running';
    }

   

    const result = await Subscription.create([payload], { session:createdSession });
    console.log('result==', result);

  //   const paymentData = {
  //     userId: user._id,
  //     method: 'paypal',
  //     amount: existingPackage.price,
  //     status: 'paid',
  //     transactionId: payload.transactionId,
  //     transactionDate: new Date(),
  //     subscriptionId: result[0]._id,
  //   };

  //  const payment = await Payment.create([paymentData], { session });

   if (result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Subscription create faild!!!!');
    }

    await createdSession.commitTransaction();

    return result[0];
  } catch (error) {
    if (createdSession.inTransaction()) {
      await createdSession.abortTransaction();
    }
    console.error('Error during subscription creation transaction:', error);
    createdSession.endSession();
    throw error;
  } 
  // finally {
  //   createdSession.endSession();
  // }
};


const getAllMysubscriptionQuery = async (query: Record<string, unknown>, userId: string) => {
 
  if (query.running && query.running === 'subscription'){
    console.log('subscription');

    const result = await Subscription.findOne({
      userId: userId,
      isDeleted: false,
      endDate: { $gt: new Date() },
      type: ['monthly', 'yearly'],
      $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
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

  }else if (query.all && query.all === 'package') {
    console.log('query.all==', 'package');
    delete query.all;

    const subscriptionQuery = new QueryBuilder(
      Subscription.find({
        userId: userId,
        isDeleted: false,
        type: 'one_time',
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
    console.log('result==', result);

    const meta = await subscriptionQuery.countTotal();
    return { meta, result };
  } else if (query.running && query.running === 'package') {
    console.log('query.running==', query.running);
    delete query.running; 

    const subscriptionQuery = new QueryBuilder(
      Subscription.find({
        userId: userId,
        isDeleted: false,
        type: 'one_time',
        status: 'pending',
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
    console.log('result==', result);

    const meta = await subscriptionQuery.countTotal();
    return { meta, result };
  } else {
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
