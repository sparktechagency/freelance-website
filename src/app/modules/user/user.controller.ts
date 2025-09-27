import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';

import httpStatus from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
  // console.log("user body", req.body);
 

  if (req?.file) {
    req.body.profile = storeFile('profile', req?.file?.filename);
  }

  
  const createUserToken = await userService.createUserToken(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Check email for OTP',
    data: { createUserToken },
  });
});

const userCreateVarification = catchAsync(async (req, res) => {
  const token = req.headers?.token as string;
  const { otp } = req.body;
  const newUser = await userService.otpVerifyAndCreateUser({ otp, token });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User create successfully',
    data: newUser,
  });
});

const freelancerResponse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id;
  const newUser = await userService.freelancerResponse(userId, id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Freelancer response successfully',
    data: newUser,
  });
});


// const userSwichRole = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const newUser = await userService.userSwichRoleService(userId);

//   return sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Swich role successfully',
//     data: newUser,
//   });
// });

// rest >...............

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUserQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Users All are requered successful!!',
  });
});

const getAllUserCount = catchAsync(async (req, res) => {
  const result = await userService.getAllUserCount();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Users All Count successful!!',
  });
});

const getAllUserRasio = catchAsync(async (req, res) => {
  const yearQuery = req.query.year;

  // Safely extract year as string
  const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;

  if (!year || isNaN(year)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid year provided!',
      data: {},
    });
  }

  const result = await userService.getAllUserRatio(year);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Users All Ratio successful!!',
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile fetched successfully',
    data: result,
  });
});
const getAllFreelancers = catchAsync(async (req: Request, res: Response) => {
  
  const result = await userService.getAllFreelancers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Freelancers fetched successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  // if (req?.file) {
  //   req.body.profile = storeFile('profile', req?.file?[0]);
  // }
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (imageFiles.profile && imageFiles.profile.length > 0) {
    req.body.profile = imageFiles.profile[0].path.replace(/^public[\\/]/, '');
  }
  if (imageFiles.coverPhoto && imageFiles.coverPhoto.length > 0) {
    req.body.coverPhoto = imageFiles.coverPhoto[0].path.replace(
      /^public[\\/]/,
      '',
    );
  }

  const result = await userService.updateUser(req?.user?.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile updated successfully',
    data: result,
  });
});

const blockedUser = catchAsync(async (req: Request, res: Response) => {
  const {userId} = req.user;
  const result = await userService.blockedUser(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Blocked successfully',
    data: result,
  });
});

const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteMyAccount(req.user?.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  userCreateVarification,
  freelancerResponse,
  // userSwichRole,
  getUserById,
  getMyProfile,
  getAllFreelancers,
  updateMyProfile,
  blockedUser,
  deleteMyAccount,
  getAllUsers,
  getAllUserCount,
  getAllUserRasio,
};
