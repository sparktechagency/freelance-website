import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { IJobs } from './jobs.interface';
import { Jobs } from './jobs.model';
import { Category } from '../category/category.model';
import { ServiceType } from '../serviceType/serviceType.model';
import { notificationService } from '../notification/notification.service';

const createJobs = async (payload: IJobs) => {
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
  const result = await Jobs.create(payload);
  const notificationData = {
    userId: result.userId,
    message: `New job has been created by ${payload.title}`,
    type: 'success',
    role: 'client',
  };

  await notificationService.createNotification(notificationData);
  return result;
};

const getAllCreateJobsQuery = async (query: Record<string, unknown>) => {
  const ServicecreateJobsQuery = new QueryBuilder(
    Jobs.find({ isDeleted: false, endDate: { $gt: new Date() } }),
    query,
  )
    .search(['title', 'description', 'categoryName', 'serviceTypeName'])
    .filter()
    .sort()
    .paginate()
    .fields();

    
    const result = await ServicecreateJobsQuery.modelQuery;
    console.log('result', result);
  const meta = await ServicecreateJobsQuery.countTotal();
  return { meta, result };
};

const getAllCreateJobsByClientQuery = async (
  query: Record<string, unknown>,
  userId: string
) => {
  const ServicecreateJobsQuery = new QueryBuilder(
    Jobs.find({ isDeleted: false, userId: userId }),
    query,
  )
    .search(['title', 'description', 'categoryName', 'serviceTypeName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ServicecreateJobsQuery.modelQuery;
  const meta = await ServicecreateJobsQuery.countTotal();
  return { meta, result };
};

const getSingleCreateJobs = async (id: string) => {
  const ServicecreateJobs = await Jobs.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  mongoose;
  if (ServicecreateJobs.length === 0) {
    throw new AppError(404, 'ServicecreateJobs not found!');
  }

  return ServicecreateJobs[0];
};

const updateCreateJobs = async (
  id: string,
  payload: Partial<IJobs>,
) => {
  // console.log('id ', id);
  // console.log('payload ', payload);

  const ServicecreateJobs = await Jobs.findById(id);
  if (!ServicecreateJobs) {
    throw new AppError(404, 'ServicecreateJobs is not found!');
  }
  console.log({ payload });

  if (Object.keys(payload).length === 0) {
    throw new AppError(404, 'Payload is not found!');
  }

  const result = await Jobs.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};



const deleteCreateJobs = async (id: string) => {
  const ServicecreateJobs = await Jobs.findById(id);
  if (!ServicecreateJobs) {
    throw new AppError(404, 'ServicecreateJobs is not found!');
  }

  // Delete the SaveStory
  const result = await Jobs.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const createJobsService = {
  createJobs,
  getAllCreateJobsQuery,
  getAllCreateJobsByClientQuery,
  getSingleCreateJobs,
  updateCreateJobs,
  deleteCreateJobs,
};
