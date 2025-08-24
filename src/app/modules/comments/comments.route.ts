import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { commentController } from './comments.controller';

const commentsRouter = express.Router();


commentsRouter
  .post(
    '/create-comment-or-reply',
    auth(USER_ROLE.USER),
    commentController.createComment,
  )
  .post(
    '/like-comment',
    auth(USER_ROLE.USER, USER_ROLE.DOCTOR),
    commentController.handleLikeForComments,
  )
  .get(
    '/post/:id',
    //  auth(USER_ROLE.ADMIN),
    commentController.getAllCommentByDoctor,
  )
  .get('/:id', commentController.getSingleComment)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    commentController.updateSingleComment,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    commentController.deleteSingleComment,
  );

export default commentsRouter;
