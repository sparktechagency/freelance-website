import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { purchestPackageService } from './purchestPackage.service';

const createPurchest = catchAsync(async (req, res) => {
  const payload = req.body;
  const {userId} = req.user

  payload.userId = userId

  const result = await purchestPackageService.createPurchestPackage(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Purchest Create successful!!',
  });
});

const getAllPurchest = catchAsync(async (req, res) => {
  const { meta, result } = await purchestPackageService.getAllPurchestPackageQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Purchest are requered successful!!',
  });
});

const getSinglePurchest = catchAsync(async (req, res) => {
  const result = await purchestPackageService.getSinglePurchestPackageQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Purchest are requered successful!!',
  });
});

const updateSinglePurchest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await purchestPackageService.updateSinglePurchestPackageQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Purchest  are updated successful!!',
  });
});

const deleteSinglePurchest = catchAsync(async (req, res) => {
  const result = await purchestPackageService.deletedPurchestPackageQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Purchest are successful!!',
  });
});

export const purchestController = {
  createPurchest,
  getAllPurchest,
  getSinglePurchest,
  updateSinglePurchest,
  deleteSinglePurchest,
};
