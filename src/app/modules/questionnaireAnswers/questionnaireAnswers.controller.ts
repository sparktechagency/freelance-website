import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { questionnaireAnswerService } from './questionnaireAnswers.service';

const createQuestionnaireAnswer = catchAsync(async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  payload.userId = userId;

  const result =
    await questionnaireAnswerService.createQuestionnaireAnswer(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'createQuestionnaireAnswer Create successful!!',
  });
});

const getAllcreateQuestionnaireAnswer = catchAsync(async (req, res) => {
  const { meta, result } =
    await questionnaireAnswerService.getAllQuestionnaireAnswerQuery(
      req.query,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All createQuestionnaireAnswer are requered successful!!',
  });
});

const getcreateQuestionnaireAnswerByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result =
    await questionnaireAnswerService.getQuestionnaireAnswerByUserQuery( userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: 'CreateQuestionnaireAnswer user are requered successful!!',
  });
});

const getSinglecreateQuestionnaireAnswer = catchAsync(async (req, res) => {
  const result =
    await questionnaireAnswerService.getSingleQuestionnaireAnswerQuery(
      req.params.id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single createQuestionnaireAnswer are requered successful!!',
  });
});

const updateSinglecreateQuestionnaireAnswer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result =
    await questionnaireAnswerService.updateSingleQuestionnaireAnswerQuery(
      id,
      payload,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single createQuestionnaireAnswer  are updated successful!!',
  });
});

const deleteSinglecreateQuestionnaireAnswer = catchAsync(async (req, res) => {
  const result =
    await questionnaireAnswerService.deletedQuestionnaireAnswerQuery(
      req.params.id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single createQuestionnaireAnswer are successful!!',
  });
});

export const createQuestionnaireAnswerController = {
  createQuestionnaireAnswer,
  getAllcreateQuestionnaireAnswer,
  getcreateQuestionnaireAnswerByUser,
  getSinglecreateQuestionnaireAnswer,
  updateSinglecreateQuestionnaireAnswer,
  deleteSinglecreateQuestionnaireAnswer,
};
