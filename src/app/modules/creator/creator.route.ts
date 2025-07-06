import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { creatorController } from './creator.controller';
import fileUpload from '../../middleware/fileUpload';
import s3FileUpload from '../../middleware/s3FileUpload';

const creatorRouter = express.Router();
// const upload = s3FileUpload('./public/uploads/video');
const upload = fileUpload('./public/uploads/video');



creatorRouter
  .post(
    '/create-creator',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([
      { name: 'ugcExampleVideo', maxCount: 6 },
      { name: 'introductionvideo', maxCount: 1 },
      { name: 'profile', maxCount: 1 },
    ]),

    creatorController.createCreator,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    creatorController.getAllCreator,
  )
  .get('/me', auth(USER_ROLE.CREATOR), creatorController.getCreatorMe)
  .get('/:id', creatorController.getSingleCreator)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    creatorController.updateSingleCreator,
  )
  .patch(
    '/approved-cancel/:id',
     auth(USER_ROLE.ADMIN),
    creatorController.approvedCancelSingleCreator,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    creatorController.deleteSingleCreator,
  );

export default creatorRouter;
