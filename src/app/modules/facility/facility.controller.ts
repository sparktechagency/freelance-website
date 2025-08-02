import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { facilityService } from './facility.service';

const createFacility = catchAsync(async (req, res) => {
  const payload = req.body;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('imageFiles', imageFiles);

  if (imageFiles?.image && imageFiles.image.length > 0) {
    // payload.images = imageFiles.images.map((file) =>
    //   file.path.replace(/^public[\\/]/, ''),
    // );
    payload.image = imageFiles.image[0].path.replace(/^public[\\/]/, '');
  }

  const result = await facilityService.createFacility(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Facility Create successful!!',
  });
});

const getAllFacility = catchAsync(async (req, res) => {
  const { meta, result } = await facilityService.getAllFacilityQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Facility are requered successful!!',
  });
});

const getSingleFacility = catchAsync(async (req, res) => {
  const result = await facilityService.getSingleFacilityQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Facility are requered successful!!',
  });
});

const updateSingleFacility = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('imageFiles', imageFiles);

  if (imageFiles?.image && imageFiles.image.length > 0) {
    // payload.images = imageFiles.images.map((file) =>
    //   file.path.replace(/^public[\\/]/, ''),
    // );
    payload.image = imageFiles.image[0].path.replace(/^public[\\/]/, '');
  }

  const result = await facilityService.updateSingleFacilityQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Facility  are updated successful!!',
  });
});

const deleteSingleFacility = catchAsync(async (req, res) => {
  const result = await facilityService.deletedFacilityQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Facility are successful!!',
  });
});

export const facilityController = {
  createFacility,
  getAllFacility,
  getSingleFacility,
  updateSingleFacility,
  deleteSingleFacility,
};
