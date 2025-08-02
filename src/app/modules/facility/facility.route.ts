import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { facilityController } from './facility.controller';

const facilityRouter = express.Router();
const upload = fileUpload('./public/uploads/facility');


facilityRouter
  .post(
    '/create-facility',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    facilityController.createFacility,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    facilityController.getAllFacility,
  )
  .get('/:id', facilityController.getSingleFacility)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    facilityController.updateSingleFacility,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    facilityController.deleteSingleFacility,
  );

export default facilityRouter;
