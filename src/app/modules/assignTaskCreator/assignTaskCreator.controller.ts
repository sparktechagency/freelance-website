import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { assignTaskCreatorService } from './assignTaskCreator.service';

const createAssignTaskCreator = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await assignTaskCreatorService.createAssignTaskCreator(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'AssignTaskCreator Create successful!!',
  });
});

const getAllAssignTaskCreator = catchAsync(async (req, res) => {
  const { meta, result } = await assignTaskCreatorService.getAllAssignTaskCreatorQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All AssignTaskCreator are requered successful!!',
  });
});

const getAssignTaskCreatorByCreatorOrUser = catchAsync(async (req, res) => {
    const { userId } = req.user;
  const { meta, result } =
    await assignTaskCreatorService.getAllAssignTaskCreatorOfUserQuery(
      req.query,
      userId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All AssignTaskCreator are requered successful!!',
  });
});

const getSingleAssignTaskCreator = catchAsync(async (req, res) => {
  const result = await assignTaskCreatorService.getSingleAssignTaskCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator are requered successful!!',
  });
});

const singleAssignTaskCreatorApprovedCancel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const status = req.body.status;

  const result =
    await assignTaskCreatorService.singleAssignTaskCreatorApprovedCancelQuery(
      id,
      status,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator  are updated successful!!',
  });
});

const deleteSingleAssignTaskCreator = catchAsync(async (req, res) => {
  const result = await assignTaskCreatorService.deletedAssignTaskCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single AssignTaskCreator are successful!!',
  });
});

export const assignTaskCreatorController = {
  createAssignTaskCreator,
  getAllAssignTaskCreator,
  getAssignTaskCreatorByCreatorOrUser,
  getSingleAssignTaskCreator,
  singleAssignTaskCreatorApprovedCancel,
  deleteSingleAssignTaskCreator,
};
