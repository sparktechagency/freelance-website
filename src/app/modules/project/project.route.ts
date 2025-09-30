import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import fileUpload from '../../middleware/fileUpload';
import { projectController } from './project.controller';

const upload = fileUpload('./public/uploads/project');

const projectRoutes = Router();

projectRoutes
  .post(
    '/create-project',

    auth(USER_ROLE.FREELANCER),
    upload.fields([{ name: 'image' }]),
    // upload.single('image'),
    //   validateRequest(paymnetValidation),
    projectController.createProject,
  )
  .get('/me', auth(USER_ROLE.FREELANCER), projectController.getAllProject)
  .get('/freelancer-project/:id', projectController.getAllProjectByFreelancerId)
  .get('/:id', projectController.getSingleProject)
  .patch(
    '/:id',
    auth(USER_ROLE.FREELANCER),
    // upload.fields([{ name: 'image' }]),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    projectController.updateProject,
  )
  .delete('/:id', auth(USER_ROLE.FREELANCER), projectController.deletedProject);

export default projectRoutes;
