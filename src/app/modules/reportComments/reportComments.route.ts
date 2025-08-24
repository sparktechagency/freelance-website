import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { reportcommentController } from './reportComments.controller';

const reportcommentsRouter = express.Router();


reportcommentsRouter
  .post(
    '/create-report-comments',
    auth(USER_ROLE.USER),
    reportcommentController.createReportComment,
  )

  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    reportcommentController.getAllReportCommentByDoctor,
  )
  .get('/:id', reportcommentController.getSingleReportComment)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    reportcommentController.updateSingleReportComment,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    reportcommentController.deleteSingleReportComment,
  );

export default reportcommentsRouter;
