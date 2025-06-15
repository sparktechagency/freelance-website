import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { creatorService } from './creator.service';

const createCreator = catchAsync(async (req, res) => {
  const payload = req.body;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const result = await creatorService.createCreator(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Creator Create successful!!',
  });
});

const getAllCreator = catchAsync(async (req, res) => {
  const { meta, result } = await creatorService.getAllCreatorQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Creator are requered successful!!',
  });
});

const getCreatorMe = catchAsync(async (req, res) => {
  const {email} = req.user
  const result  = await creatorService.getCreatorMeQuery(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Creator are info successful!!',
  });
});

const getSingleCreator = catchAsync(async (req, res) => {
  const result = await creatorService.getSingleCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Creator are requered successful!!',
  });
});

const updateSingleCreator = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await creatorService.updateSingleCreatorQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Creator  are updated successful!!',
  });
});

const deleteSingleCreator = catchAsync(async (req, res) => {
  const result = await creatorService.deletedCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Creator are successful!!',
  });
});

export const creatorController = {
  createCreator,
  getAllCreator,
  getCreatorMe,
  getSingleCreator,
  updateSingleCreator,
  deleteSingleCreator,
};
