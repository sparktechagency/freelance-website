import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { blogController } from './blog.controller';
import fileUpload from '../../middleware/fileUpload';

const blogRouter = express.Router();
const upload = fileUpload('./public/uploads/blog');


blogRouter
  .post(
    '/create-blog',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([
      { name: 'image', maxCount: 1 },
      // { name: 'bodyImage', maxCount: 1 },
      // { name: 'upload3Photos', maxCount: 3 },
      // { name: 'ugcImage', maxCount: 1 },
    ]),
    blogController.createBlog,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    blogController.getAllBlog,
  )
  .get('/:id', blogController.getSingleBlog)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),

    upload.fields([
      { name: 'image', maxCount: 1 },
      // { name: 'bodyImage', maxCount: 1 },
      // { name: 'upload3Photos', maxCount: 3 },
      // { name: 'ugcImage', maxCount: 1 },
    ]),
    blogController.updateSingleBlog,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    blogController.deleteSingleBlog,
  );

export default blogRouter;
