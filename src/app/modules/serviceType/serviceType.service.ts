import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { IServiceType } from './serviceType.interface';
import { ServiceType } from './serviceType.model';

const createServiceType = async (payload: IServiceType) => {
  const exists = await ServiceType.findOne({ name: payload.name });
  if (exists) {
    throw new AppError(403, 'ServicecreateServiceType already exists!!');
  }
  const result = await ServiceType.create(payload);
  return result;
};


const getAllCreateServiceTypeQuery = async (query: Record<string, unknown>) => {
  const ServicecreateServiceTypeQuery = new QueryBuilder(
    ServiceType.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ServicecreateServiceTypeQuery.modelQuery;
  const meta = await ServicecreateServiceTypeQuery.countTotal();
  return { meta, result };
};

const getAllCreateServiceTypeByAdminQuery = async (query: Record<string, unknown>) => {
  const ServicecreateServiceTypeQuery = new QueryBuilder(
    ServiceType.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ServicecreateServiceTypeQuery.modelQuery;
  const meta = await ServicecreateServiceTypeQuery.countTotal();
  return { meta, result };
};

const getSingleCreateServiceType = async (id: string) => {
  const ServicecreateServiceType = await ServiceType.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  mongoose;
  if (ServicecreateServiceType.length === 0) {
    throw new AppError(404, 'ServicecreateServiceType not found!');
  }

  return ServicecreateServiceType[0];
};

const updateCreateServiceType = async (id: string, payload: Partial<IServiceType>) => {
  // console.log('id ', id);
  // console.log('payload ', payload);

  const ServicecreateServiceType = await ServiceType.findById(id);
  if (!ServicecreateServiceType) {
    throw new AppError(404, 'ServicecreateServiceType is not found!');
  }
  console.log({ payload });

  if (Object.keys(payload).length === 0) {
    throw new AppError(404, 'Payload is not found!');
  }

  const result = await ServiceType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

const createServiceTypeActiveDeactiveService = async (id: string) => {
  const ServicecreateServiceType = await ServiceType.findById(id);
  if (!ServicecreateServiceType) {
    throw new AppError(404, 'ServicecreateServiceType is not found!');
  }

  let status;

  if (ServicecreateServiceType.isActive) {
    status = false;
  } else {
    status = true;
  }
  const result = await ServiceType.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true },
  );
  let message;
  if (result?.isActive) {
    message = 'ServicecreateServiceType actived successful';
  } else {
    message = 'ServicecreateServiceType deactive successful';
  }
  return { result, message };
};

const deleteCreateServiceType = async (id: string) => {
  const ServicecreateServiceType = await ServiceType.findById(id);
  if (!ServicecreateServiceType) {
    throw new AppError(404, 'ServicecreateServiceType is not found!');
  }

  // Delete the SaveStory
  const result = await ServiceType.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const createServiceTypeService = {
  createServiceType,
  getAllCreateServiceTypeQuery,
  getAllCreateServiceTypeByAdminQuery,
  getSingleCreateServiceType,
  updateCreateServiceType,
  createServiceTypeActiveDeactiveService,
  deleteCreateServiceType,
};
