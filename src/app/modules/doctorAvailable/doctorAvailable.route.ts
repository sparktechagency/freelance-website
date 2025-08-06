import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { doctorAvailableController } from './doctorAvailable.controller';

const doctorAvailableRouter = express.Router();


doctorAvailableRouter
  .post(
    '/create-available',
     auth(USER_ROLE.DOCTOR),
    doctorAvailableController.createDoctorAvailable,
  )
  .get(
    '/',
     auth(USER_ROLE.DOCTOR),
    doctorAvailableController.getAllDoctorAvailable,
  )
  .get('/:id', doctorAvailableController.getSingleDoctorAvailable)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    doctorAvailableController.updateSingleDoctorAvailable,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    doctorAvailableController.deleteSingleDoctorAvailable,
  );

export default doctorAvailableRouter;
