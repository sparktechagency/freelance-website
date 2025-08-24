import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { doctorService } from './doctor.service';

const updateDoctorinfo = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const payload = req.body;

   const imageFiles = req.files as {
     [fieldname: string]: Express.Multer.File[];
   };
  console.log('imageFiles', imageFiles);
 

  const result = await doctorService.updateDoctorInfo(imageFiles, userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Doctor credentials update successful!!',
  });
});


const updateAvailability = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const payload = req.body;


  const result = await doctorService.updateAvailability(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Availability update successful!!',
  });
});


const getDoctorByDoctor = catchAsync(async (req, res) => {
    const { userId } = req.user;
  const result = await doctorService.getDoctorInfoByDoctorQuery(
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All Doctor are requered successful!!',
  });
});


const getAllDoctor = catchAsync(async (req, res) => {
  const { meta, result } =
    await doctorService.getAllDoctorQuery( req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Doctor are requered successful!!',
  });
});

const getSingleDoctor = catchAsync(async (req, res) => {
  const result = await doctorService.getSingleDoctorQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Doctor are requered successful!!',
  });
});

const updateSingleDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await doctorService.updateSingleDoctorQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Doctor  are updated successful!!',
  });
});

const deleteSingleDoctor = catchAsync(async (req, res) => {
  const result = await doctorService.deletedDoctorQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Doctor are successful!!',
  });
});

export const doctorController = {
  updateDoctorinfo,
  getDoctorByDoctor,
  updateAvailability,
  getAllDoctor,
  getSingleDoctor,
  updateSingleDoctor,
  deleteSingleDoctor,
};
