import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TQuestionnaire } from './questionnaire.interface';
import Questionnaire from './questionnaire.model';
import { access, unlink } from 'fs/promises';

const createQuestionnaire = async (files: any, payload: TQuestionnaire) => {
  try {
    console.log('QcreateQuestionnaire payload=', payload);
    if (files?.image && files?.image?.length > 0) {
      payload.image = files.image[0].path.replace(/^public[\\/]/, '');
    }

    const result = await Questionnaire.create(payload);

    if (!result) {
      throw new AppError(403, 'QcreateQuestionnaire create faild!!');
    }

    return result;
  } catch (error: any) {
    console.log('error', error);
    const imagePath = `public/${payload.image}`;
    await access(imagePath);

    await unlink(imagePath);

    throw new AppError(error.statusCode, error.message);
  }
};

const getAllQuestionnaireQuery = async (query: Record<string, unknown>) => {
  const QcreateQuestionnaireQuery = new QueryBuilder(
    Questionnaire.find(),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await QcreateQuestionnaireQuery.modelQuery;

  const meta = await QcreateQuestionnaireQuery.countTotal();
  return { meta, result };
};

const getSingleQuestionnaireQuery = async (id: string) => {
  const questions = await Questionnaire.findById(id);
  if (!questions) {
    throw new AppError(404, 'questions Not Found!!');
  }
  return questions;
};

const updateSingleQuestionnaireQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const questions: any = await Questionnaire.findById(id);
  if (!questions) {
    throw new AppError(404, 'QcreateQuestionnaire is not found!');
  }

  const result = await Questionnaire.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'Questionnaire updated faild!!');
  }

  return result;
};

const deletedQuestionnaireQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const questions = await Questionnaire.findById(id);
  if (!questions) {
    throw new AppError(404, 'QcreateQuestionnaire Not Found!!');
  }

  const result = await Questionnaire.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Questionnaire Result Not Found !');
  }

  return result;
};

export const questionnaireService = {
  createQuestionnaire,
  getAllQuestionnaireQuery,
  getSingleQuestionnaireQuery,
  updateSingleQuestionnaireQuery,
  deletedQuestionnaireQuery,
};
