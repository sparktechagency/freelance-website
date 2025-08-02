import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { reservationsController } from './reservations.controller';

const reservationsRouter = express.Router();


reservationsRouter
  .post(
    '/create-reservations',
    //  auth(USER_ROLE.ADMIN),
    reservationsController.createReservations,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    reservationsController.getAllReservations,
  )
  .get('/:id', reservationsController.getSingleReservations)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    reservationsController.updateSingleReservations,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    reservationsController.deleteSingleReservations,
  );

export default reservationsRouter;
