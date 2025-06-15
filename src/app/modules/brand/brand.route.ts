import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { brandController } from './brand.controller';

const brandRouter = express.Router();
const upload = fileUpload('./public/uploads/ugcImage');

brandRouter
  .post(
    '/create-brand',
     auth(USER_ROLE.USER),
    upload.fields([
      { name: 'ugcPhotos', maxCount: 5 },
    ]),
    brandController.createBrand,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    brandController.getAllBrand,
  )
  .get('/:id', brandController.getSingleBrand)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    brandController.updateSingleBrand,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    brandController.deleteSingleBrand,
  );

export default brandRouter;
