import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { createQuestionnaireAnswerController } from './questionnaireAnswers.controller';

const questionnaireAnswersRouter = express.Router();


questionnaireAnswersRouter
  .post(
    '/create-question-answer',
    auth(USER_ROLE.USER),
    createQuestionnaireAnswerController.createQuestionnaireAnswer,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    createQuestionnaireAnswerController.getAllcreateQuestionnaireAnswer,
  )
  .get(
    '/user',
    auth(USER_ROLE.USER),
    createQuestionnaireAnswerController.getcreateQuestionnaireAnswerByUser,
  )
  .get(
    '/:id',
    createQuestionnaireAnswerController.getSinglecreateQuestionnaireAnswer,
  )
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    createQuestionnaireAnswerController.updateSinglecreateQuestionnaireAnswer,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    createQuestionnaireAnswerController.deleteSinglecreateQuestionnaireAnswer,
  );

export default questionnaireAnswersRouter;
