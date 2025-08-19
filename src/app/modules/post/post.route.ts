import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { postController } from './post.controller';
import fileUpload from '../../middleware/fileUpload';

const postRouter = express.Router();
const uploads = fileUpload('./public/uploads/post');


postRouter
  .post(
    '/create-post',
     auth(USER_ROLE.USER),
    // uploads.fields([{ name: 'image', maxCount: 1 }]),
    postController.createPost,
  )
  .post(
    '/like/:id',
     auth(USER_ROLE.USER),
    // uploads.fields([{ name: 'image', maxCount: 1 }]),
    postController.createPostLike,
  )
  .post(
    '/highlight/:id',
     auth(USER_ROLE.DOCTOR),
    // uploads.fields([{ name: 'image', maxCount: 1 }]),
    postController.createPostHighlight,
  )
  .get('/',  postController.getAllPost)
  .get('/:id',  postController.getSinglePost)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    postController.updateSinglePost,
  )
  
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    postController.deleteSinglePost,
  );

export default postRouter;
