import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { serviceTypeController } from './serviceType.controller';
import fileUpload from '../../middleware/fileUpload';

const upload = fileUpload('./public/uploads/serviceType');

const serviceTypeRoutes = Router();

serviceTypeRoutes
  .post(
    '/create-service-type',

    auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'image' }]),
    // upload.single('image'),
    //   validateRequest(paymnetValidation),
    serviceTypeController.createServiceType,
  )

  .get('', serviceTypeController.getAllServiceType)
  .get(
    '/admin',
    auth(USER_ROLE.ADMIN),
    serviceTypeController.getAllServiceTypeByAdmin,
  )
  .get('/:id', serviceTypeController.getSingleServiceType)
  .patch(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    // upload.fields([{ name: 'image' }]),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    serviceTypeController.updateServiceType,
  )
  .patch(
    '/isActive/:id',
    // auth(USER_ROLE.ADMIN),
    serviceTypeController.serviceTypeActiveDeactive,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    serviceTypeController.deletedServiceType,
  );

export default serviceTypeRoutes;
