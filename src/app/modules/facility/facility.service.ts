import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TFacility } from './facility.interface';
import Facility from './facility.model';
import { access, unlink } from 'fs/promises';

const createFacility = async (payload: TFacility) => {
    try {
      console.log('Facility payload=', payload);

      const result = await Facility.create(payload);

      if (!result) {
        throw new AppError(403, 'Car creation failed!');
      }

      return result;
    } catch (error: any) {
          await access(`public/${payload.image}`);
          await unlink(`public/${payload.image}`);

      throw new AppError(httpStatus.BAD_REQUEST, error.message);
    }
  
};

const getAllFacilityQuery = async (query: Record<string, unknown>) => {
  const facilityQuery = new QueryBuilder(Facility.find({isDeleted: false}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facilityQuery.modelQuery;

  const meta = await facilityQuery.countTotal();
  return { meta, result };
};

const getSingleFacilityQuery = async (id: string) => {
  const facility: any = await Facility.findById(id);
  if (!facility) {
    throw new AppError(404, 'Facility Not Found!!');
  }
  return facility;
};

const updateSingleFacilityQuery = async (id: string, payload: any) => {

  try {
    console.log('id', id);
    console.log('updated payload', payload);
    const facility: any = await Facility.findById(id);
    if (!facility) {
      throw new AppError(404, 'Facility is not found!');
    }

    const result = await Facility.findByIdAndUpdate(id, payload, { new: true });

    if (!result) {
      throw new AppError(403, 'Facility updated faild!!');
    }

    return result;
  } catch (error: any) {
    await access(`public/${payload.image}`);
    await unlink(`public/${payload.image}`);

    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const deletedFacilityQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const facility = await Facility.findById(id);
  if (!facility) {
    throw new AppError(404, 'Facility Not Found!!');
  }

  const result = await Facility.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new AppError(404, 'Facility Result Not Found !');
  }

  return result;
};

export const facilityService = {
  createFacility,
  getAllFacilityQuery,
  getSingleFacilityQuery,
  updateSingleFacilityQuery,
  deletedFacilityQuery,
};
