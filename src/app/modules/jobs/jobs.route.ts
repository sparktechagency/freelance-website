import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import fileUpload from '../../middleware/fileUpload';
import { jobsController } from './jobs.controller';

const upload = fileUpload('./public/uploads/jobs');

const jobsRoutes = Router();

jobsRoutes
  .post(
    '/create-jobs',

    auth(USER_ROLE.CLIENT),
    upload.fields([{ name: 'image' }]),
    // upload.single('image'),
    //   validateRequest(paymnetValidation),
    jobsController.createJobs,
  )

  .get('', jobsController.getAllJobs)
  .get('/me', auth(USER_ROLE.CLIENT), jobsController.getAllJobsByClient)
  .get('/:id', jobsController.getSingleJobs)
  .patch(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    // upload.fields([{ name: 'image' }]),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    jobsController.updateJobs,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    jobsController.deletedJobs,
  );

export default jobsRoutes;
