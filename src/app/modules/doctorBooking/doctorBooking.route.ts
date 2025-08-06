import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { doctorAvailableController } from './doctorBooking.controller';

const doctorBookingRouter = express.Router();


doctorBookingRouter
  .post(
    '/create-doctor-booking',
    auth(USER_ROLE.USER),
    doctorAvailableController.createDoctorAvailable,
  )
  .get(
    '/user/',
    auth(USER_ROLE.USER),
    doctorAvailableController.getAllDoctorAvailable,
  )
  .get('/:id', doctorAvailableController.getSingleDoctorAvailable)
  .get(
    '/available-slots/:doctorId',
    doctorAvailableController.getSingleDoctorAvailableSlots,
  )
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

export default doctorBookingRouter;
