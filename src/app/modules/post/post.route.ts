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
    auth(USER_ROLE.CLIENT),
    uploads.fields([{ name: 'image', maxCount: 1 }]),
    postController.createPost,
  )
  // .post(
  //   '/like/:id',
  //    auth(USER_ROLE.USER),
  //   // uploads.fields([{ name: 'image', maxCount: 1 }]),
  //   postController.createPostLike,
  // )
  // .post(
  //   '/highlight/:id',
  //    auth(USER_ROLE.DOCTOR),
  //   // uploads.fields([{ name: 'image', maxCount: 1 }]),
  //   postController.createPostHighlight,
  // )
  .get('/me', auth(USER_ROLE.CLIENT), postController.getAllPost)
  .get('/:id', postController.getSinglePost)
  .patch('/:id', auth(USER_ROLE.CLIENT), uploads.fields([{ name: 'image', maxCount: 1 }]), postController.updateSinglePost)

  .delete(
    '/:id',
    auth(USER_ROLE.CLIENT),
    postController.deleteSinglePost,
  );

export default postRouter;
