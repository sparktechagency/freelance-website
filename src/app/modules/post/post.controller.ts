import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { postService } from './post.service';

const createPost = catchAsync(async (req, res) => {
const {userId} = req.user;
  const payload = req.body;
  payload.userId = userId;

  // const imageFiles = req.files as {
  //   [fieldname: string]: Express.Multer.File[];
  // };

  const result = await postService.createPost( payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Post Create successful!!',
  });
});

const createPostLike = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const {id} = req.params;

  // const imageFiles = req.files as {
  //   [fieldname: string]: Express.Multer.File[];
  // };

  const result = await postService.createPostLike(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Post like successful!!',
  });
});


const createPostHighlight = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  // const imageFiles = req.files as {
  //   [fieldname: string]: Express.Multer.File[];
  // };

  const result = await postService.createPostHighlight(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Post highlight successful!!',
  });
});

const getAllPost = catchAsync(async (req, res) => {
  // const { userId } = req.user;
  const { meta, result } = await postService.getAllPostQuery(
    req.query,
    // userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Post are requered successful!!',
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const result = await postService.getSinglePostQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Post are requered successful!!',
  });
});

const updateSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await postService.updateSinglePostQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Post  are updated successful!!',
  });
});

const deleteSinglePost = catchAsync(async (req, res) => {
  const result = await postService.deletedPostQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Post are successful!!',
  });
});

export const postController = {
  createPost,
  createPostLike,
  createPostHighlight,
  getAllPost,
  getSinglePost,
  updateSinglePost,
  deleteSinglePost,
};
