import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { assignTaskCreatorController } from './assignTaskCreator.controller';
import fileUpload from '../../middleware/fileUpload';

const assignTaskCreatorRouter = express.Router();
const upload = fileUpload('./public/uploads/uploadVideos');


assignTaskCreatorRouter
  .post(
    '/create-assign-task-creator',
     auth(USER_ROLE.ADMIN),
    assignTaskCreatorController.createAssignTaskCreator,
  )
  .get(
    '/',
     auth(USER_ROLE.ADMIN),
    assignTaskCreatorController.getAllAssignTaskCreator,
  )
  .get(
    '/assign',
    auth(USER_ROLE.CREATOR, USER_ROLE.USER),
    assignTaskCreatorController.getAssignTaskCreatorByCreatorOrUser,
  )
  .get('/:id', assignTaskCreatorController.getSingleAssignTaskCreator)
  .get(
    '/hire-creator-to-assign-creator/:id',
    assignTaskCreatorController.getSingleHireCreatorToAssignTaskCreator,
  )
  .patch(
    '/status/:id',
    auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.singleAssignTaskCreatorApprovedCancel,
  )
  .patch(
    '/approved/:id',
     auth(USER_ROLE.ADMIN),
    assignTaskCreatorController.singleAssignTaskCreatorApprovedByAdmin,
  )
  .patch(
    '/uploadVideos/:id',
    auth(USER_ROLE.CREATOR),
    upload.fields([{ name: 'uploadVideos' }]),
    assignTaskCreatorController.assignTaskCreatorUploadVideosByCreator,
  )
  .patch(
    '/revision/:id',
    auth(USER_ROLE.USER),
    assignTaskCreatorController.assignTaskRevisionByUser,
  )
  .patch(
    '/revision/:id',
    auth(USER_ROLE.USER),
    assignTaskCreatorController.assignTaskRevisionByUser,
  )
  .patch(
    '/re-uploadVideos/:id',
    auth(USER_ROLE.CREATOR),
    upload.fields([{ name: 'uploadVideos' }]),
    assignTaskCreatorController.assignTaskCreatorReSubmitUploadVideosByCreator,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.deleteSingleAssignTaskCreator,
  );

export default assignTaskCreatorRouter;
