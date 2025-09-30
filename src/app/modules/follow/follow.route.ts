import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { followController } from './follow.controller';

const followRouter = express.Router();


followRouter
  .post('/create-follow', auth(USER_ROLE.CLIENT), followController.createFollow)
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    followController.getAllFollow,
  )
  .get('/:id', followController.getSingleFollow)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    followController.updateSingleFollow,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    followController.deleteSingleFollow,
  );

export default followRouter;
