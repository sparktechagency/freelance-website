import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import fileUpload from '../../middleware/fileUpload';
import { tenderController } from './tenders.controller';

const upload = fileUpload('./public/uploads/jobs');

const tenderRoutes = Router();

tenderRoutes
  .post(
    '/create-tender',
    auth(USER_ROLE.CLIENT),
    upload.fields([{ name: 'image' }]),
    // upload.single('image'),
    //   validateRequest(paymnetValidation),
    tenderController.createTender,
  )

  .get('', tenderController.getAllTender)
  .get('/me', auth(USER_ROLE.CLIENT), tenderController.getAllTenderByClient)
  .get('/me/public/:id', tenderController.getAllPublicTenderByClient)
  .get('/running-tenders/:clientId', 
     tenderController.getAllRunningTender)
  .get('/:id', tenderController.getSingleTender)
  .patch(
    '/respond/:id',
    auth(USER_ROLE.FREELANCER),
    tenderController.respondTender,
  )
  .patch(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    // upload.fields([{ name: 'image' }]),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    tenderController.updateTender,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    tenderController.deletedTender,
  );

export default tenderRoutes;
