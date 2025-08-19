import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TDoctor } from './doctor.interface';
import Doctor from './doctor.model';

const updateDoctorInfo = async (files:any, userId: string, payload: TDoctor) => {
  try {
      if (
        !payload.workingPlace ||
        !payload.experience ||
        !payload.specialization ||
        !payload.details
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'All fields are required',
        );
      }

      const existingDoctor = await Doctor.findOne({ userId: userId });
      if (!existingDoctor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
      }

      console.log('files', files);

      if(!files || !files?.documents || !files?.documents?.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Documents are required');
      }

    if (files?.documents && files?.documents?.length > 0) {
      payload.documents = files?.documents?.map((file: any) => file.path.replace(/^public[\\/]/, ''));
    }


    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId: payload.userId },
       payload ,
      { new: true },
    );

    if (!updatedDoctor) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Doctor UPDATE failed ');
    }
     
    return updatedDoctor;
    
  } catch (error:any) {
    throw new AppError(error.statusCode, error.message);
    
  }

  
};


const updateAvailability = async (userId: string, payload: any) => {
  const existingDoctor = await Doctor.findOne({ userId: userId });
  if (!existingDoctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found!');
  }

  const updatedDoctor = await Doctor.findOneAndUpdate(
    { userId: userId },
    { $push: { availability: { $each: payload } } },
    { new: true },
  );

  if (!updatedDoctor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Doctor UPDATE failed!');
  }

  return updatedDoctor;
};


const getDoctorInfoByDoctorQuery = async (userId: string) => {
  const result = await Doctor.findOne({ userId: userId });

  return result;
};

const getAllDoctorQuery = async (query: Record<string, unknown>) => {
  const DoctorQuery = new QueryBuilder(Doctor.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DoctorQuery.modelQuery;

  const meta = await DoctorQuery.countTotal();
  return { meta, result };
};

const getSingleDoctorQuery = async (id: string) => {
  const doctor: any = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(404, 'Doctor Not Found!!');
  }
  return doctor;
};

const updateSingleDoctorQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const doctorProduct: any = await Doctor.findById(id);
  if (!doctorProduct) {
    throw new AppError(404, 'Doctor is not found!');
  }

  const result = await Doctor.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'Doctor updated faild!!');
  }

  return result;
};

const deletedDoctorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(404, 'Doctor Not Found!!');
  }

  const result = await Doctor.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'Doctor Result Not Found !');
  }

  return result;
};

export const doctorService = {
  updateDoctorInfo,
  getAllDoctorQuery,
  getDoctorInfoByDoctorQuery,
  updateAvailability,
  getSingleDoctorQuery,
  updateSingleDoctorQuery,
  deletedDoctorQuery,
};
