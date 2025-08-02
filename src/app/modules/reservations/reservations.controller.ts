import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { resercreateReservationService } from './reservations.service';

const createReservations = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await resercreateReservationService.createReservation();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Reservations Create successful!!',
  });
});

const getAllReservations = catchAsync(async (req, res) => {
  // const { meta, result } = await resercreateReservationService.getAllPropertyQuery();

  const { meta, result } = await resercreateReservationService.getAllResercreateReservationQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Reservations are requered successful!!',
  });
});

const getSingleReservations = catchAsync(async (req, res) => {
  const result = await resercreateReservationService.getSingleResercreateReservationQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Reservations are requered successful!!',
  });
});

const updateSingleReservations = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await resercreateReservationService.updateSingleResercreateReservationQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Reservations  are updated successful!!',
  });
});

const deleteSingleReservations = catchAsync(async (req, res) => {
  const result = await resercreateReservationService.deletedResercreateReservationQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Reservations are successful!!',
  });
});


export const reservationsController = {
  createReservations,
  getAllReservations,
  getSingleReservations,
  updateSingleReservations,
  deleteSingleReservations,
};
