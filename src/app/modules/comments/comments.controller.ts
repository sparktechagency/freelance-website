import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { commentService } from './comments.service';

const createComment = catchAsync(async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  payload.userId = userId;

  const result = await commentService.createCommentOrReply(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Comment Create successful!!',
  });
});


const handleLikeForComments = catchAsync(async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  payload.userId = userId;

  const result = await commentService.handleLikeForComments(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Comment Like Create successful!!',
  });
});


const getAllCommentByDoctor = catchAsync(async (req, res) => {
    const {id} = req.params;
  const  result  = await commentService.getAllCommentByDoctorQuery(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All Comment are requered successful!!',
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const result = await commentService.getSingleCommentQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Comment are requered successful!!',
  });
});

const updateSingleComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await commentService.updateSingleCommentQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Comment  are updated successful!!',
  });
});

const deleteSingleComment = catchAsync(async (req, res) => {
  const result = await commentService.deletedCommentQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Comment are successful!!',
  });
});

export const commentController = {
  createComment,
  handleLikeForComments,
  getAllCommentByDoctor,
  getSingleComment,
  updateSingleComment,
  deleteSingleComment,
};
