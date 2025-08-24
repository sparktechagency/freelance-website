// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { categoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  console.log('hit hoise');

  const uploadedFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const categoryData = req.body;

  console.log({ categoryData });
  console.log({ uploadedFiles });
  console.log(req.files);

  if (
    !uploadedFiles ||
    !uploadedFiles.image ||
    uploadedFiles.image.length === 0
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
  }

  categoryData.image = uploadedFiles.image[0].path.replace(/^public[\\/]/, '');

  console.log({ categoryData });
  const result = await categoryService.createCategory(categoryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Category create successful',
  });
});

// const getAllCategory = catchAsync(async (req, res) => {

//   const result = await categoryService.getAllCategoryQuery(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     meta: result.meta,
//     data: result.result,
//     message: 'Category All are requered successful!!',
//   });
// });

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategoryQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Category All are requered successful!!',
  });
});

const getAllCategoryByAdmin = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategoryByAdminQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Category All are requered successful!!',
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getSingleCategory(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Category get successful',
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  console.log('Request received:', req.body, req.files);
  console.log('hit hoise');
  
  const categoryData = req.body;
  console.log({ categoryData });
  
  

  // Handle uploaded image if it exists
  const uploadedImage = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('uploadedImage11', uploadedImage);

  if (uploadedImage?.image && uploadedImage.image.length > 0) {
    // Remove 'public/' or 'public\' from the start of the path
    categoryData.image = uploadedImage.image[0].path.replace(
      /^public[\\/]/,
      '',
    );
  }

  console.log('uploadedImage', uploadedImage);
  console.log('category data=2', categoryData);
  console.log('id', req.params.id);

  // Call update service with updated data
  const result = await categoryService.updateCategory(
    req.params.id,
    categoryData,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Category updated successfully',
  });
});

const categoryActiveDeactive = catchAsync(
  async (req: Request, res: Response) => {
    const { result, message } =
      await categoryService.categoryActiveDeactiveService(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: message,
    });
  },
);

const deletedCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.deleteCategory(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

export const categoryController = {
  createCategory,
  getAllCategory,
  getAllCategoryByAdmin,
  getSingleCategory,
  updateCategory,
  categoryActiveDeactive,
  deletedCategory,
};
