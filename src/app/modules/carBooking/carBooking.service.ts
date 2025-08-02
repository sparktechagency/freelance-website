import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCarBooking } from './carBooking.interface';
import CarBooking from './carBooking.model';
import { User } from '../user/user.models';
import { paymentService } from '../payment/payment.service';
import Car from '../car/car.model';
import formatAMPM, { isBookingOverlapping } from './carBooking.utils';
import { all } from 'axios';
import moment from 'moment';
import mongoose from 'mongoose';

const createCarBooking = async (payload: TCarBooking) => {
  try {
    console.log('CarBooking payload=', payload);

    const carExist = await Car.findById(payload.carId);
    // console.log('carExist==', carExist);
    if (!carExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car not found!');
    }

    const userExist = await User.findById(payload.userId);
    if (!userExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found!');
    }

    const {  carId } = payload;

    const existingCarBooking: any = await CarBooking.find({
      carId,
      status: 'confirmed',
    });


    if (isBookingOverlapping(existingCarBooking, payload)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car is already booked for this date range');
    } 
    
    payload.bookingDate = new Date(Date.now());

    const result = await CarBooking.create(payload);

    if (!result) {
      throw new AppError(403, 'Car Booking creation failed!');
    }

    const paymentData = {
      bookingId: result._id,
      amount: result.totalAmount,
    };

    const paymentUrl = await paymentService.createCheckout(userExist._id, paymentData);

    // return result;
    return paymentUrl;
  } catch (error: any) {
    throw new AppError(error.statusCode, error.message);
  }
};
  

const getAllCarBookingQuery = async (query: Record<string, unknown>) => {
  const CarBookingQuery = new QueryBuilder(CarBooking.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CarBookingQuery.modelQuery;

  const meta = await CarBookingQuery.countTotal();
  return { meta, result };
};

const getSingleCarBookingBookingSlotsQuery = async (carId: string, month: string, year: string) => {
  console.log('carId', carId);
  console.log('month', month);
  const monthYear = `${year}-${month}`; // 'year-month'; 
  const startOfMonth = moment(monthYear, 'YYYY-MM').startOf('month').toDate(); // '2025-08-01'
  const endOfMonth = moment(monthYear, 'YYYY-MM').endOf('month').toDate(); // '2025-08-31'

  console.log('startOfMonth', startOfMonth);
  console.log('endOfMonth', endOfMonth);

  const allCarBooking = await CarBooking.find({
    carId,
    startDate: { $gte: startOfMonth, $lte: endOfMonth },
  }).lean().select('startDate endDate');

  // const allCarBooking: any = await CarBooking.find({ carId })
  //   .select('carId startDate endDate')
  //   .lean();

  const allSlots = allCarBooking.map((booking: any) => ({
    startDate: moment(booking.startDate).format('YYYY-MM-DD'),
    endDate: moment(booking.endDate).format('YYYY-MM-DD'),
  }));
  console.log('allCarBooking==', allCarBooking);
  console.log('allSlots==', allSlots);

  return allSlots;
};

const getSingleCarBookingQuery = async (id: string) => {
  const carBooking: any = await CarBooking.findById(id);
  if (!carBooking) {
    throw new AppError(404, 'CarBooking Not Found!!');
  }
  return carBooking;
};

const updateSingleCarBookingQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const carBooking: any = await CarBooking.findById(id);
  if (!carBooking) {
    throw new AppError(404, 'CarBooking is not found!');
  }

  const result = await CarBooking.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'CarBooking updated faild!!');
  }

  return result;
};

const deletedCarBookingQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const carBooking = await CarBooking.findById(id);
  if (!carBooking) {
    throw new AppError(404, 'CarBooking Not Found!!');
  }

  const result = await CarBooking.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'CarBooking Result Not Found !');
  }

  return result;
};

export const carBookingService = {
  createCarBooking,
  getAllCarBookingQuery,
  getSingleCarBookingQuery,
  getSingleCarBookingBookingSlotsQuery,
  updateSingleCarBookingQuery,
  deletedCarBookingQuery,
};
