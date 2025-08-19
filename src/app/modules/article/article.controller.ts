import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { articleService } from './article.service';

const createArticle = catchAsync(async (req, res) => {
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await articleService.createArticle(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Article Create successful!!',
  });
});

const getAllArticle = catchAsync(async (req, res) => {
  const { userId } = req.user;  
  const { meta, result } = await articleService.getAllArticleQuery(req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Article are requered successful!!',
  });
});



const getSingleArticle = catchAsync(async (req, res) => {
  const { userId } = req.user;  
  const result = await articleService.getSingleArticleQuery(req.params.id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Article are requered successful!!',
  });
});

const updateSingleArticle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await articleService.updateSingleArticleQuery(
    id,
    imageFiles,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Article  are updated successful!!',
  });
});




const deleteSingleArticle = catchAsync(async (req, res) => {
  const result = await articleService.deletedArticleQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Article are successful!!',
  });
});

export const articleController = {
  createArticle,
  getAllArticle,
  getSingleArticle,
  updateSingleArticle,
  deleteSingleArticle,
};
