import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TDoctorBooking } from './doctorBooking.interface';
import DoctorBooking from './doctorBooking.model';
import moment from 'moment';
import DoctorAvailability from '../doctorAvailable/doctorAvailable.model';
import { User } from '../user/user.models';
import { getAvailableTimeSlots } from './doctorBooking.utils';

// const createDoctorAvailable = async (payload: TDoctorBooking) => {
//   console.log('DoctorAvailable payload=', payload);

//   const checkingAvailableThisDay = await DoctorAvailability.findOne({doctorId: payload.doctorId});

//   if (!checkingAvailableThisDay) {
//     throw new AppError(404, 'DoctorAvailable is not found!');
//   }

//   const day = moment(payload.bookingDate).format('dddd');

//    const isDayAvailable = checkingAvailableThisDay.availability.some(
//      (avail: any) => avail.day === day,
//    );

//    if (!isDayAvailable) {
//      throw new AppError(
//        404,
//        `No doctor is available on ${day}. Please choose another day.`,
//      );
//    }

//      const isValidTimeFormat = (time: string) =>
//        moment(time, 'hh:mm A', true).isValid();

//      if (!isValidTimeFormat(payload.startTime) || !isValidTimeFormat(payload.endTime)) {
//        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid time format ! Please use hh:mm A');
//      }

//      const existingDoctorBooking = await DoctorBooking.findOne({
//        doctorId: payload.doctorId,
//        bookingDate: payload.bookingDate,
//        status: 'booked',
//        $or: [
//          {
//            $and: [
//              { startTime: { $gte: payload.startTime } },
//              { startTime: { $lte: payload.endTime } },
//            ],
//          },

//          {
//            $and: [
//              { endTime: { $gte: payload.startTime } },
//              { endTime: { $lte: payload.endTime } },
//            ],
//          },
//        ],
//      })

//      console.log('existingDoctorBooking', existingDoctorBooking);

//      if (existingDoctorBooking) {
//        throw new AppError(
//          httpStatus.BAD_REQUEST,
//          'Booking time is overlapping with an existing booking',
//        );
//      }

//      const doctorBooking = await DoctorBooking.create(payload);
//      console.log('doctorBooking', doctorBooking);

//   return doctorBooking;
// };

const createDoctorAvailable = async (payload: TDoctorBooking) => {
  console.log('DoctorAvailable payload=', payload);

  const checkingAvailableThisDay = await DoctorAvailability.findOne({
    doctorId: payload.doctorId,
  });

  if (!checkingAvailableThisDay) {
    throw new AppError(404, 'DoctorAvailable is not found!');
  }

  const day = moment(payload.bookingDate).format('dddd');

  const isDayAvailable = checkingAvailableThisDay.availability.some(
    (avail: any) => avail.day === day,
  );

  if (!isDayAvailable) {
    throw new AppError(
      404,
      `No doctor is available on ${day}. Please choose another day.`,
    );
  }

  const isValidTimeFormat = (time: string) =>
    moment(time, 'hh:mm A', true).isValid();

  if (
    !isValidTimeFormat(payload.startTime) ||
    !isValidTimeFormat(payload.endTime)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid time format! Please use hh:mm A',
    );
  }

  const startTimeMoment = moment(payload.startTime, 'hh:mm A');
  let endTimeMoment = moment(payload.endTime, 'hh:mm A');
  endTimeMoment = endTimeMoment.subtract(1, 'minute');

  payload.endTime = endTimeMoment.format('hh:mm A');

  console.log('new payload', payload);

  const existingDoctorBooking = await DoctorBooking.findOne({
    doctorId: payload.doctorId,
    bookingDate: payload.bookingDate,
    status: 'booked',
    $or: [
      {
        $and: [
          { startTime: { $gte: startTimeMoment.format('hh:mm A') } },
          { startTime: { $lte: endTimeMoment.format('hh:mm A') } },
        ],
      },
      {
        $and: [
          { endTime: { $gte: startTimeMoment.format('hh:mm A') } },
          { endTime: { $lte: endTimeMoment.format('hh:mm A') } },
        ],
      },
    ],
  });

  console.log('existingDoctorBooking', existingDoctorBooking);

  if (existingDoctorBooking) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Booking time is overlapping with an existing booking',
    );
  }

  const doctorBooking = await DoctorBooking.create(payload);
  console.log('doctorBooking', doctorBooking);

  return doctorBooking;
};

const getAllDoctorAvailableQuery11 = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const doctorAvailability = await DoctorBooking.find({
    doctorId: userId,
  });

  return doctorAvailability;
};

const getAllDoctorAvailableQuery = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const DoctorAvailableQuery = new QueryBuilder(
    DoctorBooking.find({ userId: userId }),
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
  const DoctorAvailable: any = await DoctorBooking.findById(id);
  if (!DoctorAvailable) {
    throw new AppError(404, 'DoctorAvailable Not Found!!');
  }
  return DoctorAvailable;
};
const getSingleDoctorAvailableSlotsQuery = async (doctorId: string, date: string) => {
  const doctor = await User.findById(doctorId);
  if (!doctor) {
    throw new AppError(404, 'Doctor Not Found!!');
  }

  if (doctor.role !== 'doctor') {
    throw new AppError(404, 'You are not a doctor!!');
  }

  const doctorAvailable = await DoctorAvailability.findOne({
    doctorId: doctorId,
  });
  if (!doctorAvailable) {
    throw new AppError(404, 'Doctor Availability Not Found!!');
  }

  const formattedDate = new Date(date);
  const startOfDay = new Date(formattedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(formattedDate.setHours(23, 59, 59, 999));

  const allBooking: any = await DoctorBooking.find({
    doctorId: doctorId,
    bookingDate: { $gte: startOfDay, $lte: endOfDay },
  }).select('bookingDate startTime endTime');

  console.log('allBooking111', allBooking);

  const day = moment(date).format('dddd');

  const isDayAvailable = doctorAvailable.availability.filter(
    (avail: any) => avail.day === day,
  );

  if (isDayAvailable.length === 0) {
    throw new AppError(404, 'No doctor is available on this day.');
  }

  console.log('isDayAvailable', isDayAvailable);

  const doctorAvailability:any ={
    startTime: isDayAvailable[0].startTime,
    endTime: isDayAvailable[0].endTime,
    timeDuration: 30,
    lanchStartTime: isDayAvailable[0].lanchStartTime,
    lanchEndTime: isDayAvailable[0].lanchEndTime
  }
  console.log('doctorAvailability111', doctorAvailability);

  const availableTimeSlots = await getAvailableTimeSlots(
    doctorAvailability,
    allBooking,
  );

  console.log('Final Available Time Slots:', availableTimeSlots);

  return '';
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
  getSingleDoctorAvailableSlotsQuery,
  updateSingleDoctorAvailableQuery,
  deletedDoctorAvailableQuery,
};
