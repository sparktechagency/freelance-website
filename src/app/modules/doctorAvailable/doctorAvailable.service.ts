import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TDoctorAvailable } from './doctorAvailable.interface';
import DoctorAvailability from './doctorAvailable.model';

const createDoctorAvailable = async (payload: TDoctorAvailable) => {
  console.log('DoctorAvailable payload=', payload);

  const isExist = await DoctorAvailability.findOne({
    doctorId: payload.doctorId
  })

  if (isExist) {
    const result = await DoctorAvailability.findOneAndUpdate(
      { doctorId: payload.doctorId },
      { availability: payload.availability },
      { new: true }
    )

    return result;
  }else{
      const result = await DoctorAvailability.create(payload);
    if (!result) {
      throw new AppError(403, 'DoctorAvailable create faild!!');
    }

    return result;
  }


  
};

const getAllDoctorAvailableQuery = async (userId: string,query: Record<string, unknown>) => {

    const doctorAvailability = await DoctorAvailability.find({ doctorId: userId }); 
 
    return doctorAvailability;
};

const getAllDoctorAvailableQuery111 = async (userId: string,query: Record<string, unknown>) => {
  const DoctorAvailableQuery = new QueryBuilder(
    DoctorAvailability.find(),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DoctorAvailableQuery.modelQuery;

  const meta = await DoctorAvailableQuery.countTotal();
  return { meta, result };
};

const getSingleDoctorAvailableQuery = async (id: string) => {
  const DoctorAvailable: any = await DoctorAvailability.findById(id);
  if (!DoctorAvailable) {
    throw new AppError(404, 'DoctorAvailable Not Found!!');
  }
  return DoctorAvailable;
};

const updateSingleDoctorAvailableQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const DoctorAvailableProduct: any = await DoctorAvailability.findById(id);
  if (!DoctorAvailableProduct) {
    throw new AppError(404, 'DoctorAvailable is not found!');
  }

  const result = await DoctorAvailability.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'DoctorAvailable updated faild!!');
  }

  return result;
};

const deletedDoctorAvailableQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const doctorAvailable = await DoctorAvailability.findById(id);
  if (!doctorAvailable) {
    throw new AppError(404, 'DoctorAvailable Not Found!!');
  }

  const result = await DoctorAvailability.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'DoctorAvailable Result Not Found !');
  }

  return result;
};

export const doctorAvailableService = {
  createDoctorAvailable,
  getAllDoctorAvailableQuery,
  getSingleDoctorAvailableQuery,
  updateSingleDoctorAvailableQuery,
  deletedDoctorAvailableQuery,
};
