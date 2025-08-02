import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { carController } from './car.controller';

const carRouter = express.Router();
const upload = fileUpload('./public/uploads/car');


carRouter
  .post(
    '/create-car',
    upload.fields([{ name: 'images', maxCount: 10 }]),
    carController.createCar,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    carController.getAllCar,
  )
  .get('/:id', carController.getSingleCar)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'images', maxCount: 10 }]),
    carController.updateSingleCar,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    carController.deleteSingleCar,
  );

export default carRouter;
