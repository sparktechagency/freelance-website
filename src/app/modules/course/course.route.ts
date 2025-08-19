import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { courseController } from './course.controller';
import fileUpload from '../../middleware/fileUpload';

const courseRouter = express.Router();
const uploads = fileUpload('./public/uploads/course');


courseRouter
  .post(
    '/create-course',
    //  auth(USER_ROLE.ADMIN),
    uploads.fields([{ name: 'video', maxCount: 1 }]),
    courseController.createCourse,
  )
  .get(
    '/',
    auth(USER_ROLE.USER),
    courseController.getAllCourse,
  )
  .get('/:id',auth(USER_ROLE.USER), courseController.getSingleCourse)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    courseController.updateSingleCourse,
  )
  .patch(
    '/view-count/:id',
    //  auth(USER_ROLE.ADMIN),
    courseController.viewCountSingleCourse,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    courseController.deleteSingleCourse,
  );

export default courseRouter;
