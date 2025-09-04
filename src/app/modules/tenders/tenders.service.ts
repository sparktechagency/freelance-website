import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Category } from '../category/category.model';
import { ServiceType } from '../serviceType/serviceType.model';
import { ITenders } from './tenders.interface';
import { Tender } from './tenders.model';

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
  const result = await Tender.create(payload);
  return result;
};

const getAllCreateTenderQuery = async (query: Record<string, unknown>) => {
  const ServicecreateTenderQuery = new QueryBuilder(
    Tender.find({ isDeleted: false }),
    query,
  )
    .search([''])
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
    .search([''])
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
  getSingleCreateTender,
  updateCreateTender,
  deleteCreateTender,
};
