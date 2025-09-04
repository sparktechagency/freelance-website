// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { createJobsService } from './jobs.service';

const createJobs = catchAsync(async (req: Request, res: Response) => {
  console.log('hit hoise');
  const { userId } = req.user;

  const uploadedFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const JobsData = req.body;

  console.log({ JobsData });
  console.log({ uploadedFiles });

  if (
    !uploadedFiles ||
    !uploadedFiles.image ||
    uploadedFiles.image.length === 0
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
  }

  if(uploadedFiles && uploadedFiles.image ){
    // throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
    JobsData.image = uploadedFiles.image[0].path.replace(
      /^public[\\/]/,
      '',
    );

  }

  

  console.log({ JobsData });
  JobsData.userId = userId;
  const result = await createJobsService.createJobs(JobsData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Jobs create successful',
  });
});

// const getAllJobs = catchAsync(async (req, res) => {

//   const result = await createJobsService.getAllJobsQuery(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     meta: result.meta,
//     data: result.result,
//     message: 'Jobs All are requered successful!!',
//   });
// });

const getAllJobs = catchAsync(async (req, res) => {
  const result = await createJobsService.getAllCreateJobsQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Jobs All are requered successful!!',
  });
});

const getAllJobsByClient = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const result = await createJobsService.getAllCreateJobsByClientQuery(
    req.query, userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Jobs All are requered successful!!',
  });
});

const getSingleJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await createJobsService.getSingleCreateJobs(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Jobs get successful',
  });
});

const updateJobs = catchAsync(async (req: Request, res: Response) => {
  console.log('Request received:', req.body, req.files);
  console.log('hit hoise');
  
  const JobsData = req.body;
  console.log({ JobsData });
  
  

  // Handle uploaded image if it exists
  const uploadedImage = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('uploadedImage11', uploadedImage);

  if (uploadedImage?.image && uploadedImage.image.length > 0) {
    // Remove 'public/' or 'public\' from the start of the path
    JobsData.image = uploadedImage.image[0].path.replace(
      /^public[\\/]/,
      '',
    );
  }

  console.log('uploadedImage', uploadedImage);
  console.log('Jobs data=2', JobsData);
  console.log('id', req.params.id);

  // Call update service with updated data
  const result = await createJobsService.updateCreateJobs(
    req.params.id,
    JobsData,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Jobs updated successfully',
  });
});



const deletedJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await createJobsService.deleteCreateJobs(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

export const jobsController = {
  createJobs,
  getAllJobs,
  getAllJobsByClient,
  getSingleJobs,
  updateJobs,
  deletedJobs,
};
