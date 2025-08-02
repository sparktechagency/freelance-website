import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { carBookingController } from './carBooking.controller';

const carBookingRouter = express.Router();


carBookingRouter
  .post(
    '/create-booking',
    auth(USER_ROLE.USER),
    carBookingController.createCarBooking,
  )
  .get('/', auth(USER_ROLE.USER), carBookingController.getAllCarBooking)
  .get('/:id', carBookingController.getSingleCarBooking)
  .get('/available/:id', carBookingController.getSingleCarBookingBookedingSlots)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    carBookingController.updateSingleCarBooking,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.USER),
    carBookingController.deleteSingleCarBooking,
  );

export default carBookingRouter;
