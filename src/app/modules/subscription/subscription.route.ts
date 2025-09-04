import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { subscriptionController } from './subscription.controller';
import fileUpload from '../../middleware/fileUpload';

const subcriptionRouter = express.Router();

const upload = fileUpload('./public/uploads/subscription');


subcriptionRouter
  .post(
    '/create-subscription',
    auth(USER_ROLE.CLIENT),
    // upload.fields([{ name: 'image', maxCount: 1 }]),
    subscriptionController.createSubscription,
  )
  .get('/', auth(USER_ROLE.CLIENT), subscriptionController.getAllMySubscription)
  .get(
    '/existe',
    auth(USER_ROLE.CLIENT),
    subscriptionController.getExistSubscription,
  )
  .get('/:id', subscriptionController.getSingleSubscription)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),

    upload.fields([{ name: 'image', maxCount: 1 }]),
    subscriptionController.updateSingleSubscription,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    subscriptionController.deleteSingleSubscription,
  );

export default subcriptionRouter;
