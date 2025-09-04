import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { packageController } from './package.controller';

const packageRouter = express.Router();
const upload = fileUpload('./public/uploads/package');


packageRouter
  .post(
    '/create-package',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    packageController.createPackage,
  )
  .get(
    '/packages',
    //  auth(USER_ROLE.ADMIN),
    packageController.getAllPackage,
  )
  .get(
    '/subscription-packages',
    //  auth(USER_ROLE.ADMIN),
    packageController.getAllSubscriptionPackage,
  )
  .get('/:id', packageController.getSinglePackage)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    packageController.updateSinglePackage,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    packageController.deleteSinglePackage,
  );

export default packageRouter;
