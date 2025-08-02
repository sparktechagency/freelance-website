import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { blogService } from './blog.service';

const createBlog = catchAsync(async (req, res) => {
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  console.log('payload', payload);
  

  const result = await blogService.createBlog(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Blog Create successful!!',
  });
});

const getAllBlog = catchAsync(async (req, res) => {
  const { meta, result } = await blogService.getAllBlogQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Blog are requered successful!!',
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const result = await blogService.getSingleBlogQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Blog are requered successful!!',
  });
});

const updateSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const subBlogId= req.params.subBlogId
  if(subBlogId){
    payload.subBlogId=subBlogId
  }

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
 
  const result = await blogService.updateSingleBlogQuery(id, imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Blog  are updated successful!!',
  });
});

const deleteSingleBlog = catchAsync(async (req, res) => {
  const result = await blogService.deletedBlogQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Blog are successful!!',
  });
});

export const blogController = {
  createBlog,
  getAllBlog,
  getSingleBlog,
  updateSingleBlog,
  deleteSingleBlog,
};
