import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { purchestController } from './purchestPackage.controller';

const purchestRouter = express.Router();


purchestRouter
  .post(
    '/create-purchest',
    auth(USER_ROLE.USER),
    purchestController.createPurchest,
  )
  .get('/', auth(USER_ROLE.ADMIN), purchestController.getAllPurchest)
  .get('/:id', purchestController.getSinglePurchest)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    purchestController.updateSinglePurchest,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    purchestController.deleteSinglePurchest,
  );

export default purchestRouter;
