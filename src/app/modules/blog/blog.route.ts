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
    // upload.fields([
    //   { name: 'image', maxCount: 1 },
    //   { name: 'image1', maxCount: 1 },
    //   { name: 'image2', maxCount: 1 },
    // ]),
    upload.fields([
      { name: 'blogImage', maxCount: 1 },
      { name: 'blogSectionImages' },
    ]),
    // upload.any(),
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
      { name: 'blogImage', maxCount: 1 },
      { name: 'blogSectionImages' },
    ]),
    blogController.updateSingleBlog,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    blogController.deleteSingleBlog,
  );

export default blogRouter;
