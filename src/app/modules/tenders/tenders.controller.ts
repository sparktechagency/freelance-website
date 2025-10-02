// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { createTenderService } from './tenders.service';

const createTender = catchAsync(async (req: Request, res: Response) => {
  console.log('hit hoise');
  const { userId } = req.user;

  const uploadedFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const TenderData = req.body;

  console.log({ TenderData });
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
    TenderData.image = uploadedFiles.image[0].path.replace(
      /^public[\\/]/,
      '',
    );

  }

  

  console.log({ TenderData });
  TenderData.userId = userId;
  const result = await createTenderService.createTender(TenderData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Tender create successful',
  });
});

// const getAllTender = catchAsync(async (req, res) => {

//   const result = await createTenderService.getAllTenderQuery(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     meta: result.meta,
//     data: result.result,
//     message: 'Tender All are requered successful!!',
//   });
// });

const getAllTender = catchAsync(async (req, res) => {
  const result = await createTenderService.getAllCreateTenderQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Tender All are requered successful!!',
  });
});

const getAllTenderByClient = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const result = await createTenderService.getAllCreateTenderByClientQuery(
    req.query, userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Tender All are requered successful!!',
  });
});

const getAllPublicTenderByClient = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const result = await createTenderService.getAllPublicTenderByClient(
    req.query,
    clientId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Tender All are requered successful!!',
  });
});


const getAllRunningTender = catchAsync(async (req, res) => {
  const clientId = req.params.clientId;
  const result = await createTenderService.getAllRunningTenderQuery(
    clientId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: result.meta,
    data: result,
    message: 'Tender All are requered successful!!',
  });
});

const getSingleTender = catchAsync(async (req: Request, res: Response) => {
  const result = await createTenderService.getSingleCreateTender(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Tender get successful',
  });
});

const respondTender = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await createTenderService.respondTender(req.params.id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Tender respond successful',
  });
});

const updateTender = catchAsync(async (req: Request, res: Response) => {
  console.log('Request received:', req.body, req.files);
  console.log('hit hoise');
  
  const TenderData = req.body;
  console.log({ TenderData });
  
  

  // Handle uploaded image if it exists
  const uploadedImage = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('uploadedImage11', uploadedImage);

  if (uploadedImage?.image && uploadedImage.image.length > 0) {
    // Remove 'public/' or 'public\' from the start of the path
    TenderData.image = uploadedImage.image[0].path.replace(
      /^public[\\/]/,
      '',
    );
  }

  console.log('uploadedImage', uploadedImage);
  console.log('Tender data=2', TenderData);
  console.log('id', req.params.id);

  // Call update service with updated data
  const result = await createTenderService.updateCreateTender(
    req.params.id,
    TenderData,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Tender updated successfully',
  });
});



const deletedTender = catchAsync(async (req: Request, res: Response) => {
  const result = await createTenderService.deleteCreateTender(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

export const tenderController = {
  createTender,
  getAllTender,
  getAllTenderByClient,
  getAllPublicTenderByClient,
  getAllRunningTender,
  getSingleTender,
  respondTender,
  updateTender,
  deletedTender,
};
