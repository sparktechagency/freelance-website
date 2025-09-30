// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { projectService } from './project.service';

const createProject = catchAsync(async (req: Request, res: Response) => {
  console.log('hit hoise');
  const { userId } = req.user;

  const uploadedFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const projectData = req.body;

  projectData.userId = userId;

  console.log({ projectData });
  console.log({ uploadedFiles });
  console.log(req.files);

  if (
    !uploadedFiles ||
    !uploadedFiles.image ||
    uploadedFiles.image.length === 0
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
  }

  projectData.image = uploadedFiles.image[0].path.replace(/^public[\\/]/, '');

  console.log({ projectData });
  const result = await projectService.createProject(projectData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Project create successful',
  });
});

// const getAllProject = catchAsync(async (req, res) => {

//   const result = await ProjectService.getAllProjectQuery(req.query);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     meta: result.meta,
//     data: result.result,
//     message: 'Project All are requered successful!!',
//   });
// });

const getAllProject = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const result = await projectService.getAllProjectQuery(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Project All are requered successful!!',
  });
});

const getAllProjectByFreelancerId = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await projectService.getAllProjectByFreelancerId(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: result.meta,
    data: result,
    message: 'Project All are requered successful!!',
  });
});



const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.getSingleProject(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Project get successful',
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  console.log('Request received:', req.body, req.files);
  const { userId } = req.user;
  console.log('hit hoise');
  
  const ProjectData = req.body;
  console.log({ ProjectData });
  
  

  // Handle uploaded image if it exists
  const uploadedImage = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  console.log('uploadedImage11', uploadedImage);

  if (uploadedImage?.image && uploadedImage.image.length > 0) {
    // Remove 'public/' or 'public\' from the start of the path
    ProjectData.image = uploadedImage.image[0].path.replace(
      /^public[\\/]/,
      '',
    );
  }

  console.log('uploadedImage', uploadedImage);
  console.log('Project data=2', ProjectData);
  console.log('id', req.params.id);

  // Call update service with updated data
  const result = await projectService.updateProject(req.params.id,userId, ProjectData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Project updated successfully',
  });
});



const deletedProject = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.deleteProject(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

export const projectController = {
  createProject,
  getAllProject,
  getAllProjectByFreelancerId,
  getSingleProject,
  updateProject,
  deletedProject,
};
