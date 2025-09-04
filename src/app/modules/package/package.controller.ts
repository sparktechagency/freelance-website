import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { packageService } from './package.service';

const createPackage = catchAsync(async (req, res) => {
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
 

  const result = await packageService.createPackage(imageFiles,payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Package Create successful!!',
  });
});

const getAllPackage = catchAsync(async (req, res) => {
  const { meta, result } = await packageService.getAllPackageQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Package are requered successful!!',
  });
});

const getAllSubscriptionPackage = catchAsync(async (req, res) => {
  const { meta, result } = await packageService.getAllSubscriptionPackageQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Package are requered successful!!',
  });
});

const getSinglePackage = catchAsync(async (req, res) => {
  const result = await packageService.getSinglePackageQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Package are requered successful!!',
  });
});

const updateSinglePackage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  

  const result = await packageService.updateSinglePackageQuery(id, imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Package  are updated successful!!',
  });
});

const deleteSinglePackage = catchAsync(async (req, res) => {
  const result = await packageService.deletedPackageQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Package are successful!!',
  });
});

export const packageController = {
  createPackage,
  getAllPackage,
  getAllSubscriptionPackage,
  getSinglePackage,
  updateSinglePackage,
  deleteSinglePackage,
};
