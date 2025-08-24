import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { reportcommentService } from './reportComments.service';

const createReportComment = catchAsync(async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  payload.userId = userId;

  const result = await reportcommentService.createReportCommentOrReply(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'ReportComment Create successful!!',
  });
});



const getAllReportCommentByDoctor = catchAsync(async (req, res) => {
  const  result  = await reportcommentService.getAllReportCommentByDoctorQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All ReportComment are requered successful!!',
  });
});

const getSingleReportComment = catchAsync(async (req, res) => {
  const result = await reportcommentService.getSingleReportCommentQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single ReportComment are requered successful!!',
  });
});

const updateSingleReportComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await reportcommentService.updateSingleReportCommentQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single ReportComment  are updated successful!!',
  });
});

const deleteSingleReportComment = catchAsync(async (req, res) => {
  const result = await reportcommentService.deletedReportCommentQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single ReportComment are successful!!',
  });
});

export const reportcommentController = {
  createReportComment,
  getAllReportCommentByDoctor,
  getSingleReportComment,
  updateSingleReportComment,
  deleteSingleReportComment,
};
