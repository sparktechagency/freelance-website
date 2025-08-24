import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { doctorController } from './doctor.controller';
import fileUpload from '../../middleware/fileUpload';

const doctorRouter = express.Router();
const uploads = fileUpload('./public/uploads/doctor');


doctorRouter
  .post(
    '/update-info',
    auth(USER_ROLE.DOCTOR),
    uploads.fields([{ name: 'documents', maxCount: 5 }]),
    doctorController.updateDoctorinfo,
  )
  .post(
    '/update-availability',
    auth(USER_ROLE.DOCTOR),
    doctorController.updateAvailability,
  )
  .get('/doctor', auth(USER_ROLE.DOCTOR), doctorController.getDoctorByDoctor)
  .get('/', doctorController.getAllDoctor)
  .get('/:id', doctorController.getSingleDoctor)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    doctorController.updateSingleDoctor,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    doctorController.deleteSingleDoctor,
  );

export default doctorRouter;
