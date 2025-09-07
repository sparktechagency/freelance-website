import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { invoiceController } from './invoices.controller';

const invoicesRouter = express.Router();


invoicesRouter
  .post(
    '/create-invoice',
    //  auth(USER_ROLE.ADMIN),
    invoiceController.createInvoice,
  )
  .post(
    '/invoice-approve/:id',
     auth(USER_ROLE.CLIENT),
    invoiceController.invoiceApprove,
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
