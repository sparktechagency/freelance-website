import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { followService } from './follow.service';

const createFollow = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const followerUserId = req.body.followerUserId;

  const result = await followService.createFollow(userId, followerUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Follow Create successful!!',
  });
});

const getAllFollow = catchAsync(async (req, res) => {
  const { meta, result } = await followService.getAllFollowQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Follow are requered successful!!',
  });
});

const getSingleFollow = catchAsync(async (req, res) => {
  const result = await followService.getSingleFollowQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Follow are requered successful!!',
  });
});


const isFollow = catchAsync(async (req, res) => {
  const result = await followService.isFollow(req.params.id, req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Follow are successful!!',
  });
});

const updateSingleFollow = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await followService.updateSingleFollowQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Follow  are updated successful!!',
  });
});

const deleteSingleFollow = catchAsync(async (req, res) => {
  const result = await followService.deletedFollowQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Follow are successful!!',
  });
});

export const followController = {
  createFollow,
  getAllFollow,
  isFollow,
  getSingleFollow,
  updateSingleFollow,
  deleteSingleFollow,
};
