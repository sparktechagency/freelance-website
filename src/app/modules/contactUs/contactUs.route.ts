import express from 'express';
import { contactUsController } from './contactUs.controller';

const contactUsRouter = express.Router();

contactUsRouter
  .post('/create-contact', contactUsController.createContactUs)
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    contactUsController.getAllContactUs,
  )
  .get(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    contactUsController.singleContactUs,
  )
  .patch(
    '/status/:id',
    //  auth(USER_ROLE.ADMIN),
    contactUsController.singleStatusContactUs,
  )
  .delete(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    contactUsController.singleDeleteContactUs,
  );

export default contactUsRouter;
