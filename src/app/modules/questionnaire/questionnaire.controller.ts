import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { questionnaireService } from './questionnaire.service';
import { string } from 'zod';

const createQuestionnaire = catchAsync(async (req, res) => {
  const payload = req.body;
const imageFiles = req.files as {
  [fieldname: string]: Express.Multer.File[];
};

if(payload.answer && payload.answer === 'string'){
  payload.answer = JSON.parse(payload.answer);
}else{
  payload.answer = payload.answer
}



  const result = await questionnaireService.createQuestionnaire(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Questionnaire Create successful!!',
  });
});

const getAllQuestionnaire = catchAsync(async (req, res) => {
  const { meta, result } = await questionnaireService.getAllQuestionnaireQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Questionnaire are requered successful!!',
  });
});

const getSingleQuestionnaire = catchAsync(async (req, res) => {
  const result = await questionnaireService.getSingleQuestionnaireQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Questionnaire are requered successful!!',
  });
});

const updateSingleQuestionnaire = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await questionnaireService.updateSingleQuestionnaireQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Questionnaire  are updated successful!!',
  });
});

const deleteSingleQuestionnaire = catchAsync(async (req, res) => {
  const result = await questionnaireService.deletedQuestionnaireQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Questionnaire are successful!!',
  });
});

export const questionnaireController = {
  createQuestionnaire,
  getAllQuestionnaire,
  getSingleQuestionnaire,
  updateSingleQuestionnaire,
  deleteSingleQuestionnaire,
};
