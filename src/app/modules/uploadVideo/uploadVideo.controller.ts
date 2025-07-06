import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { uploadVideoService } from './uploadVideo.service';

const createUploadVideo = catchAsync(async (req, res) => {
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await uploadVideoService.createUploadVideo(
    imageFiles,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'UploadVideo Create successful!!',
  });
});

const getAllUploadVideo = catchAsync(async (req, res) => {
  console.log('hit hoise')
  const result:any = await uploadVideoService.getAllUploadVideoQuery(
    req.query,
  );
  console.log('result ===', result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result?.meta || null,
    data: result?.result ? result?.result : result || [],
    message: ' All UploadVideo are requered successful!!',
  });
});

const getSingleUploadVideo = catchAsync(async (req, res) => {
  const result = await uploadVideoService.getSingleUploadVideoQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single UploadVideo are requered successful!!',
  });
});

// const updateSingleUploadVideo = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const payload = req.body;

//   const imageFiles = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };

//   const result = await UploadVideoService.updateSingleUploadVideoQuery(
//     id,
//     imageFiles,
//     payload,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Single UploadVideo  are updated successful!!',
//   });
// });

const deleteSingleUploadVideo = catchAsync(async (req, res) => {
    const body = req.body
  const result = await uploadVideoService.deletedUploadVideoQuery(
    body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single UploadVideo are successful!!',
  });
});

export const uploadVideoController = {
  createUploadVideo,
  getAllUploadVideo,
  getSingleUploadVideo,
//   updateSingleUploadVideo,
  deleteSingleUploadVideo,
};
