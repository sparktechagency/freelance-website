import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Category } from '../category/category.model';
import { ServiceType } from '../serviceType/serviceType.model';
import { ITenders } from './tenders.interface';
import { Tender } from './tenders.model';
import Subscription from '../subscription/subscription.model';
import Chat from '../chat/chat.model';
import { notificationService } from '../notification/notification.service';

const createTender = async (payload: ITenders) => {
  const category = await Category.findById(payload.categoryId);
  if (!category) {
    throw new AppError(404, 'Category is not found!');
  }
  payload.categoryName = category.name;
  const serviceType = await ServiceType.findById(payload.serviceTypeId);
  if (!serviceType) {
    throw new AppError(404, 'serviceType is not found!');
  }
  payload.serviceTypeName = serviceType.name;

  const subscription = await Subscription.findOne({
    userId: payload.userId,
    isDeleted: false,
  });

   if (!subscription) {
     throw new AppError(403, "You don't have a subscription!");
   }

  const runningSubscription = await Subscription.findOne({
    userId: payload.userId,
    isDeleted: false,
    endDate: { $gt: new Date() },
    type: ['monthly', 'yearly'],
    $expr: { $lt: ['$takeTenderCount', '$tenderCount'] },
  });

  if (!runningSubscription) {
    throw new AppError(403, 'Your subscription is not active!');
  }

  const result = await Tender.create(payload);

  if(result){
    if(runningSubscription.type === "monthly"){
      runningSubscription.takeTenderCount += 1;
      await runningSubscription.save();
    }
  }

  const notificationData = {
    userId: result.userId,
    message: `New tender has been created by ${payload.title}`,
    type: 'success',
    role: 'client',
  };
  
    await notificationService.createNotification(notificationData);
  return result;
};

const getAllCreateTenderQuery = async (query: Record<string, unknown>) => {
  const ServicecreateTenderQuery = new QueryBuilder(
    Tender.find({ isDeleted: false, status: 'pending' }),
    query,
  )
    .search(['title', 'description', 'categoryName', 'serviceTypeName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ServicecreateTenderQuery.modelQuery;
  const meta = await ServicecreateTenderQuery.countTotal();
  return { meta, result };
};

const getAllCreateTenderByClientQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const ServicecreateTenderQuery = new QueryBuilder(
    Tender.find({ isDeleted: false, userId: userId }),
    query,
  )
    .search(['title', 'description', 'categoryName', 'serviceTypeName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ServicecreateTenderQuery.modelQuery;
  const meta = await ServicecreateTenderQuery.countTotal();
  return { meta, result };
};

const getSingleCreateTender = async (id: string) => {
  const ServicecreateTender = await Tender.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  mongoose;
  if (ServicecreateTender.length === 0) {
    throw new AppError(404, 'ServicecreateTender not found!');
  }

  return ServicecreateTender[0];
};


const getAllRunningTenderQuery = async (id: string) => {
  const result = await Tender.find({ isDeleted: false, userId: id, status: 'pending' }).select('_id title');
  return result;
};

const respondTender = async (id: string, userId: string) => {
  // console.log('id ', id);
 const tender = await Tender.findById(id);  
 if (!tender) {
   throw new AppError(404, 'Tender not found!');
 }

 const chatCreate = await Chat.create({participants: [tender.userId, userId]});
 if (!chatCreate) {
   throw new AppError(404, 'Chat not created!');
 }

  return chatCreate;
};

const updateCreateTender = async (id: string, payload: Partial<ITenders>) => {
  // console.log('id ', id);
  // console.log('payload ', payload);

  const ServicecreateTender = await Tender.findById(id);
  if (!ServicecreateTender) {
    throw new AppError(404, 'ServicecreateTender is not found!');
  }
  console.log({ payload });

  if (Object.keys(payload).length === 0) {
    throw new AppError(404, 'Payload is not found!');
  }

  const result = await Tender.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

const deleteCreateTender = async (id: string) => {
  const ServicecreateTender = await Tender.findById(id);
  if (!ServicecreateTender) {
    throw new AppError(404, 'ServicecreateTender is not found!');
  }

  // Delete the SaveStory
  const result = await Tender.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const createTenderService = {
  createTender,
  getAllCreateTenderQuery,
  getAllCreateTenderByClientQuery,
  getAllRunningTenderQuery,
  getSingleCreateTender,
  respondTender,
  updateCreateTender,
  deleteCreateTender,
};
