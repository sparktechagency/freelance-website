import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { articleController } from './article.controller';
import fileUpload from '../../middleware/fileUpload';

const articleRouter = express.Router();
const uploads = fileUpload('./public/uploads/article');


articleRouter
  .post(
    '/create-article',
    //  auth(USER_ROLE.ADMIN),
    uploads.fields([{ name: 'image', maxCount: 1 }]),
    articleController.createArticle,
  )
  .get(
    '/',
     auth(USER_ROLE.USER),
    articleController.getAllArticle,
  )
  .get('/:id',auth(USER_ROLE.USER), articleController.getSingleArticle)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    articleController.updateSingleArticle,
  )
  // .patch(
  //   '/view-count/:id',
  //   //  auth(USER_ROLE.ADMIN),
  //   articleController.viewCountSingleCourse,
  // )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    articleController.deleteSingleArticle,
  );

export default articleRouter;
