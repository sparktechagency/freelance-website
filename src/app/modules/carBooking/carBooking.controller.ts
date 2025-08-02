import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { carBookingService } from './carBooking.service';

const createCarBooking = catchAsync(async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  payload.userId = userId;

  const result = await carBookingService.createCarBooking(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Car Booking Create successful!!',
  });
});

const getAllCarBooking = catchAsync(async (req, res) => {
  const { meta, result } = await carBookingService.getAllCarBookingQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Car Booking are requered successful!!',
  });
});

const getSingleCarBooking = catchAsync(async (req, res) => {
  const result = await carBookingService.getSingleCarBookingQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Car Booking are requered successful!!',
  });
});

const getSingleCarBookingBookedingSlots = catchAsync(async (req, res) => {
  const month  = req.query.month as string;
  const year = req.query.year as string;
  console.log('id', req.params.id);
  const result = await carBookingService.getSingleCarBookingBookingSlotsQuery(
    req.params.id,
    month,
    year,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Car Booking slots are requered successful!!',
  });
});

const updateSingleCarBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await carBookingService.updateSingleCarBookingQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Car Booking  are updated successful!!',
  });
});

const deleteSingleCarBooking = catchAsync(async (req, res) => {
  const result = await carBookingService.deletedCarBookingQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Car Booking are successful!!',
  });
});

export const carBookingController = {
  createCarBooking,
  getAllCarBooking,
  getSingleCarBooking,
  getSingleCarBookingBookedingSlots,
  updateSingleCarBooking,
  deleteSingleCarBooking,
};
