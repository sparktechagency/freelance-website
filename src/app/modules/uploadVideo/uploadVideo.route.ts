import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { uploadVideoController } from './uploadVideo.controller';

const uploadVideoRouter = express.Router();
const upload = fileUpload('./public/uploads/video');

uploadVideoRouter
  .post(
    '/create',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'videos', maxCount: 5 }]),
    // (req, res) => {
    //     console.log('req.files', req.files);
    // },
    uploadVideoController.createUploadVideo,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    uploadVideoController.getAllUploadVideo,
  )
  .get('/:id', uploadVideoController.getSingleUploadVideo)

  //   .patch(
  //     '/:id',
  //     //  auth(USER_ROLE.ADMIN),
  //     upload.fields([{ name: 'image', maxCount: 1 }]),
  //     packageController.updateSinglePackage,
  //   )

  .delete(
    '/',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    uploadVideoController.deleteSingleUploadVideo,
  );

export default uploadVideoRouter;
