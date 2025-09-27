import { Router } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';
import parseData from '../../middleware/parseData';
import fileUpload from '../../middleware/fileUpload';
import { resentOtpValidations } from '../otp/otp.validation';
const upload = fileUpload('./public/uploads/profile');

export const userRoutes = Router(); 

userRoutes
  .post(
    '/create',
    upload.single('profile'),
    validateRequest(userValidation?.userValidationSchema),
    userController.createUser,
  )
  .post(
    '/create-user-verify-otp',
    validateRequest(resentOtpValidations.verifyOtpZodSchema),
    userController.userCreateVarification,
  )
  .post(
    '/freelancer-response/:id',
    auth(USER_ROLE.CLIENT),
    userController.freelancerResponse,
  )

  // .post(
  //   '/swich-role',
  //   auth(USER_ROLE.CUSTOMER, USER_ROLE.BUSINESS),
  //   userController.userSwichRole,
  // )
  .get(
    '/my-profile',
    auth(
      USER_ROLE.CLIENT,
      USER_ROLE.FREELANCER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    userController.getMyProfile,
  )
  .get(
    '/all-freelancers',
    // auth(
    //   USER_ROLE.CLIENT,
    //   USER_ROLE.FREELANCER,
    //   USER_ROLE.ADMIN,
    //   USER_ROLE.SUB_ADMIN,
    //   USER_ROLE.SUPER_ADMIN,
    // ),
    userController.getAllFreelancers,
  )
  .get('/all-users', userController.getAllUsers)
  .get('/all-users-count', userController.getAllUserCount)
  .get('/all-users-rasio', userController.getAllUserRasio)
  .get('/:id', userController.getUserById)

  .patch(
    '/update-my-profile',
    auth(
      USER_ROLE.CLIENT,
      USER_ROLE.FREELANCER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    // upload.single('profile'),
    // upload.single('coverPhoto'),
    // upload.fields({})
    upload.fields([
      { name: 'profile', maxCount: 1 },
      { name: 'coverPhoto', maxCount: 1 },
    ]),
    parseData(),
    userController.updateMyProfile,
  )
  .patch(
    '/blocked/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN, USER_ROLE.SUPER_ADMIN),
    userController.blockedUser,
  )
  .delete(
    '/delete-my-account',
    auth(
      USER_ROLE.CLIENT,
      USER_ROLE.FREELANCER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    userController.deleteMyAccount,
  );
  

// export default userRoutes;
