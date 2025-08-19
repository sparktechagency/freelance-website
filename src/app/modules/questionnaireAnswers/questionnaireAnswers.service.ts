import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TQuestionnaireAnswer } from './questionnaireAnswers.interface';
import QuestionnaireAnswer from './questionnaireAnswers.model';

const createQuestionnaireAnswer = async (payload: TQuestionnaireAnswer) => {
  console.log('QcreateQuestionnaireAnswer payload=', payload);

  const alreadyExists = await QuestionnaireAnswer.findOne({ userId: payload.userId });  

  if (alreadyExists) {
    throw new AppError(
      400,
      'QuestionnaireAnswer already exists for this user',
    );
  }

 const ids = payload.questionsAnswered.map((answer) =>
   answer.questionnaireId.toString(),
 );

 const uniqueIds = new Set(ids);
 if (ids.length !== uniqueIds.size) {
   throw new AppError(
     400,
     'Duplicate QuestionnaireAnswerId is not allowed in questionsAnswered',
   );
 }

  const result = await QuestionnaireAnswer.create(payload);

  if (!result) {
    throw new AppError(403, 'QcreateQuestionnaireAnswer create faild!!');
  }

  return result;
};

const getAllQuestionnaireAnswerQuery = async (query: Record<string, unknown>) => {
  const QcreateQuestionnaireAnswerQuery = new QueryBuilder(
    QuestionnaireAnswer.find().populate({
      path: 'userId',
      select: 'fullName profile email role',
    })
    .populate({
      path: 'questionsAnswered.questionnaireId',
      select: 'question answer',
    }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await QcreateQuestionnaireAnswerQuery.modelQuery;

  const meta = await QcreateQuestionnaireAnswerQuery.countTotal();
  return { meta, result };
};

const getQuestionnaireAnswerByUserQuery = async (
  userId: string
) => {
  const questions = await QuestionnaireAnswer.findOne({ userId })
    .populate({
      path: 'userId',
      select: 'fullName profile email role',
    })
    .populate({
      path: 'questionsAnswered.questionnaireId',
      select: 'question answer',
    });
  if (!questions) {
    throw new AppError(404, 'questions Not Found!!');
  }
  return questions;
};



const getSingleQuestionnaireAnswerQuery = async (id: string) => {
  const questions = await QuestionnaireAnswer.findById(id)
    .populate({
      path: 'userId',
      select: 'fullName profile email role',
    })
    .populate({
      path: 'questionsAnswered.questionnaireId',
      select: 'question answer',
    });
  if (!questions) {
    throw new AppError(404, 'questions Not Found!!');
  }
  return questions;
};

const updateSingleQuestionnaireAnswerQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const questions: any = await QuestionnaireAnswer.findById(id);
  if (!questions) {
    throw new AppError(404, 'QcreateQuestionnaireAnswer is not found!');
  }

  const result = await QuestionnaireAnswer.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'QuestionnaireAnswer updated faild!!');
  }

  return result;
};

const deletedQuestionnaireAnswerQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const questions = await QuestionnaireAnswer.findById(id);
  if (!questions) {
    throw new AppError(404, 'QcreateQuestionnaireAnswer Not Found!!');
  }

  const result = await QuestionnaireAnswer.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'QuestionnaireAnswer Result Not Found !');
  }

  return result;
};

export const questionnaireAnswerService = {
  createQuestionnaireAnswer,
  getAllQuestionnaireAnswerQuery,
  getQuestionnaireAnswerByUserQuery,
  getSingleQuestionnaireAnswerQuery,
  updateSingleQuestionnaireAnswerQuery,
  deletedQuestionnaireAnswerQuery,
};
