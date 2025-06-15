import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { brandService } from './brand.service';

const createBrand = catchAsync(async (req, res) => {
  const payload = req.body;
  const {userId} = req.user
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const result = await brandService.createBrand(imageFiles, payload, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Brand Create successful!!',
  });
});

const getAllBrand = catchAsync(async (req, res) => {
  const { meta, result } = await brandService.getAllBrandQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Brand are requered successful!!',
  });
});

const getSingleBrand = catchAsync(async (req, res) => {
  const result = await brandService.getSingleBrandQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Brand are requered successful!!',
  });
});

const updateSingleBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await brandService.updateSingleBrandQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Brand  are updated successful!!',
  });
});

const deleteSingleBrand = catchAsync(async (req, res) => {
  const result = await brandService.deletedBrandQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Brand are successful!!',
  });
});

export const brandController = {
  createBrand,
  getAllBrand,
  getSingleBrand,
  updateSingleBrand,
  deleteSingleBrand,
};
