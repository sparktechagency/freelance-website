import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { doctorAvailableService } from './doctorAvailable.service';

const createDoctorAvailable = catchAsync(async (req, res) => {
    const { userId } = req.user;
  const payload = req.body;
  payload.doctorId = userId;

  const result = await doctorAvailableService.createDoctorAvailable(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'DoctorAvailable Create successful!!',
  });
});

const getAllDoctorAvailable = catchAsync(async (req, res) => {
    const { userId } = req.user;
  const  result =
    await doctorAvailableService.getAllDoctorAvailableQuery(userId,req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All DoctorAvailable are requered successful!!',
  });
});


const getAllDoctorAvailable111 = catchAsync(async (req, res) => {
    const { userId } = req.user;
//   const { meta, result } =
//     await doctorAvailableService.getAllDoctorAvailableQuery(userId,req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    // data: result,
    data: [],
    message: ' All DoctorAvailable are requered successful!!',
  });
});

const getSingleDoctorAvailable = catchAsync(async (req, res) => {
  const result = await doctorAvailableService.getSingleDoctorAvailableQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single DoctorAvailable are requered successful!!',
  });
});

const updateSingleDoctorAvailable = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await doctorAvailableService.updateSingleDoctorAvailableQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single DoctorAvailable  are updated successful!!',
  });
});

const deleteSingleDoctorAvailable = catchAsync(async (req, res) => {
  const result = await doctorAvailableService.deletedDoctorAvailableQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single DoctorAvailable are successful!!',
  });
});

export const doctorAvailableController = {
  createDoctorAvailable,
  getAllDoctorAvailable,
  getSingleDoctorAvailable,
  updateSingleDoctorAvailable,
  deleteSingleDoctorAvailable,
};
