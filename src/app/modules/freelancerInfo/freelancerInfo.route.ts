import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { freelancerinfoController } from './freelancerInfo.controller';

const freelancerInfoRouter = express.Router();


freelancerInfoRouter
  .patch(
    '/update',
    auth(USER_ROLE.FREELANCER),
    freelancerinfoController.updateSingleFreelancerinfo,
  )
  .patch(
    '/update',
    auth(USER_ROLE.FREELANCER),
    freelancerinfoController.updateSingleFreelancerinfo,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    freelancerinfoController.deleteSingleFreelancerinfo,
  );

export default freelancerInfoRouter;
