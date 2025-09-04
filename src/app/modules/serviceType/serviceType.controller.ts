// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { createServiceTypeService } from './serviceType.service';

const createServiceType = catchAsync(async (req: Request, res: Response) => {
  console.log('hit hoise');

  const uploadedFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const ServiceTypeData = req.body;

  console.log({ ServiceTypeData });
  console.log({ uploadedFiles });

  // if (
  //   !uploadedFiles ||
  //   !uploadedFiles.image ||
  //   uploadedFiles.image.length === 0
  // ) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
  // }

  if(uploadedFiles && uploadedFiles.image ){
    // throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
    ServiceTypeData.image = uploadedFiles.image[0].path.replace(
      /^public[\\/]/,
      '',
    );

  }

  

  console.log({ ServiceTypeData });
  const result = await createServiceTypeService.createServiceType(ServiceTypeData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'ServiceType create successful',
  });
});

// const getAllServiceType = catchAsync(async (req, res) => {

//   const result = await createServiceTypeService.getAllServiceTypeQuery(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     meta: result.meta,
//     data: result.result,
//     message: 'ServiceType All are requered successful!!',
//   });
// });

const getAllServiceType = catchAsync(async (req, res) => {
  const result = await createServiceTypeService.getAllCreateServiceTypeQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'ServiceType All are requered successful!!',
  });
});

const getAllServiceTypeByAdmin = catchAsync(async (req, res) => {
  const result = await createServiceTypeService.getAllCreateServiceTypeByAdminQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'ServiceType All are requered successful!!',
  });
});

const getSingleServiceType = catchAsync(async (req: Request, res: Response) => {
  const result = await createServiceTypeService.getSingleCreateServiceType(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single ServiceType get successful',
  });
});

const updateServiceType = catchAsync(async (req: Request, res: Response) => {
  console.log('Request received:', req.body, req.files);
  console.log('hit hoise');
  
  const ServiceTypeData = req.body;
  console.log({ ServiceTypeData });
  
  

  // Handle uploaded image if it exists
  const uploadedImage = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('uploadedImage11', uploadedImage);

  if (uploadedImage?.image && uploadedImage.image.length > 0) {
    // Remove 'public/' or 'public\' from the start of the path
    ServiceTypeData.image = uploadedImage.image[0].path.replace(
      /^public[\\/]/,
      '',
    );
  }

  console.log('uploadedImage', uploadedImage);
  console.log('ServiceType data=2', ServiceTypeData);
  console.log('id', req.params.id);

  // Call update service with updated data
  const result = await createServiceTypeService.updateCreateServiceType(
    req.params.id,
    ServiceTypeData,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'ServiceType updated successfully',
  });
});

const serviceTypeActiveDeactive = catchAsync(
  async (req: Request, res: Response) => {
    const { result, message } =
      await createServiceTypeService.createServiceTypeActiveDeactiveService(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: message,
    });
  },
);

const deletedServiceType = catchAsync(async (req: Request, res: Response) => {
  const result = await createServiceTypeService.deleteCreateServiceType(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

export const serviceTypeController = {
  createServiceType,
  getAllServiceType,
  getAllServiceTypeByAdmin,
  getSingleServiceType,
  updateServiceType,
  serviceTypeActiveDeactive,
  deletedServiceType,
};
