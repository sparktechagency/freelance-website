import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { propertiesController } from './properties.controller';

const propertyRouter = express.Router();


propertyRouter
  .post(
    '/create-properties',
    //  auth(USER_ROLE.ADMIN),
    propertiesController.createProperties,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    propertiesController.getAllProperties,
  )
  .get('/:id', propertiesController.getSingleProperties)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    propertiesController.updateSingleProperties,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    propertiesController.deleteSingleProperties,
  );

export default propertyRouter;
