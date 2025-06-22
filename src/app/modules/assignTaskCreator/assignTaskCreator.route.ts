import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { assignTaskCreatorController } from './assignTaskCreator.controller';

const assignTaskCreatorRouter = express.Router();


assignTaskCreatorRouter
  .post('/create-assign-task-creator',
    //  auth(USER_ROLE.ADMIN), 
     assignTaskCreatorController.createAssignTaskCreator)
  .get('/',
    //  auth(USER_ROLE.ADMIN), 
     assignTaskCreatorController.getAllAssignTaskCreator)
  .get(
    '/assign',
    auth(USER_ROLE.CREATOR, USER_ROLE.USER),
    assignTaskCreatorController.getAssignTaskCreatorByCreatorOrUser,
  )
  .get('/:id', assignTaskCreatorController.getSingleAssignTaskCreator)
  .patch(
    '/status/:id',
     auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.singleAssignTaskCreatorApprovedCancel,
  )
  .patch(
    '/approved/:id',
     auth(USER_ROLE.ADMIN),
    assignTaskCreatorController.singleAssignTaskCreatorApprovedCancel,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    assignTaskCreatorController.deleteSingleAssignTaskCreator,
  );

export default assignTaskCreatorRouter;
