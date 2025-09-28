import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { invoiceController } from './invoices.controller';
import fileUpload from '../../middleware/fileUpload';

const upload = fileUpload('./public/uploads/deliveryFile');
const invoicesRouter = express.Router();


invoicesRouter
  .post(
    '/create-invoice',
    auth(USER_ROLE.FREELANCER),
    invoiceController.createInvoice,
  )
  .post(
    '/invoice-approve/:id',
    auth(USER_ROLE.CLIENT),
    invoiceController.invoiceApprove,
  )
  .post(
    '/invoice-delivery/:id',
    auth(USER_ROLE.FREELANCER),
    upload.fields([{ name: 'deliveryFiles', maxCount: 1 }]),
    invoiceController.invoiceDelivery,
  )
  .post(
    '/invoice-complete/:id',
    auth(USER_ROLE.CLIENT),
    invoiceController.invoiceComplete,
  )
  .post(
    '/invoice-extend/:id',
    auth(USER_ROLE.FREELANCER),
    invoiceController.invoiceExtend,
  )
  .post(
    '/invoice-extend-approve/:id',
    auth(USER_ROLE.CLIENT),
    invoiceController.invoiceExtendApprove,
  )
  // .post(
  //   '/invoice-extend-cancel/:id',
  //   auth(USER_ROLE.CLIENT),
  //   invoiceController.invoiceExtendCancel,
  // )
  .get(
    '/',
    // auth(USER_ROLE.ADMIN),
    invoiceController.getAllInvoices,
  )
  .get(
    '/client',
    auth(USER_ROLE.CLIENT),
    invoiceController.getAllInvoiceByClient,
  )
  .get(
    '/freelancer',
    auth(USER_ROLE.FREELANCER),
    invoiceController.getAllInvoiceByFreelancer,
  )
  .get('/:id', invoiceController.getSingleInvoice)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    invoiceController.updateSingleInvoice,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    invoiceController.deleteSingleInvoice,
  );

export default invoicesRouter;
