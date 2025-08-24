import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { courseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await courseService.createCourse(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Course Create successful!!',
  });
});

const getAllCourse = catchAsync(async (req, res) => {
    const { userId } = req.user;
  const { meta, result } = await courseService.getAllCourseQuery(req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Course are requered successful!!',
  });
});



const getSingleCourse = catchAsync(async (req, res) => {
  const {userId} = req.user
  const result = await courseService.getSingleCourseQuery(req.params.id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Course are requered successful!!',
  });
});

const updateSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await courseService.updateSingleCourseQuery(
    id,
    imageFiles,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Course  are updated successful!!',
  });
});


const viewCountSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
 

  const result = await courseService.viewCountSingleCourse(
    id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Course view  are updated successful!!',
  });
});

const deleteSingleCourse = catchAsync(async (req, res) => {
  const result = await courseService.deletedCourseQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Course are successful!!',
  });
});

export const courseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateSingleCourse,
  viewCountSingleCourse,
  deleteSingleCourse,
};
