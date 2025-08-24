import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { questionnaireController } from './questionnaire.controller';
import fileUpload from '../../middleware/fileUpload';

const questionnaireRouter = express.Router();
const uploads = fileUpload('./public/uploads/questions');


questionnaireRouter
  .post(
    '/create-question',
    uploads.fields([{ name: 'image', maxCount: 1 }]),
    //  auth(USER_ROLE.ADMIN),

    questionnaireController.createQuestionnaire,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    questionnaireController.getAllQuestionnaire,
  )
  .get('/:id', questionnaireController.getSingleQuestionnaire)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    questionnaireController.updateSingleQuestionnaire,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    questionnaireController.deleteSingleQuestionnaire,
  );

export default questionnaireRouter;
