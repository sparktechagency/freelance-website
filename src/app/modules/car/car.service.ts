import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCar } from './car.interface';
import Car from './car.model';
import { access, unlink } from 'fs/promises';

const createCar = async (payload: TCar) => {
  try {
    console.log('Car payload=', payload);

    const result = await Car.create(payload);

    if (!result) {
      throw new AppError(403, 'Car creation failed!');
    }

    return result;
  } catch (error: any) {
    for (let image of payload.images) {
      console.log('image=', image);
      try {
        await access(`public/${image}`);
        await unlink(`public/${image}`);
      } catch (error) {
        console.error(`Error accessing/unlinking image ${image}:`, error);
      }
    }

    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};


const getAllCarQuery = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(Car.find({ isDeleted: false }), query)

    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await carQuery.modelQuery;

  const meta = await carQuery.countTotal();
  return { meta, result };
};


const singleCar = async (id: string) => {
    const car = await Car.findById(id);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }
    return car;

};
const updateSingleCar = async (id: string, payload: TCar) => {
  try {
    const car = await Car.findById(id);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    if (car.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car already deleted');
    }

    const result = await Car.findByIdAndUpdate(id, payload, { new: true });

    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update car',
      );
    }

    return result;
  } catch (error: any) {
    if (payload.images && payload.images.length > 0) {
      for (let image of payload.images) {
        try {
          console.log('Deleting image:', image);
          await access(`public/${image}`);
          await unlink(`public/${image}`);
        } catch (fileError) {
          console.error(`Failed to delete image ${image}:`, fileError);
        }
      }
    }

    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};


const deleteSingleCar = async (id: string) => {
    const car = await Car.findById(id);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    if (car.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car already deleted');
    }   

    const result = await Car.updateOne({ _id: id }, { isDeleted: true });   
    if(result){
      for (let image of car.images) {
        try {
          console.log('Deleting image:', image);
          await access(`public/${image}`);
          await unlink(`public/${image}`);
        } catch (fileError) {
          console.error(`Failed to delete image ${image}:`, fileError);
        }
      }

    }
    return result;

};

export const carService = {
  createCar,
  getAllCarQuery,
  singleCar,
  updateSingleCar,
  deleteSingleCar
};
