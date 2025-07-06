import express from 'express';
import { paymentController } from './payment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const paymentRouter = express.Router();

paymentRouter
  .post('/add-payment', auth(USER_ROLE.USER), paymentController.addPayment)
  .post(
    '/create-paypal-payment',
    auth(USER_ROLE.USER),
    paymentController.createPaypalPayment,
  )
  .post(
    '/reniew-paypal-payment/:id',
    auth(USER_ROLE.USER),
    paymentController.reniewPaypalPayment,
  )
  .post(
    '/refund-paypal-payment',
    // auth(USER_ROLE.USER),
    paymentController.refundPaypalPayment,
  )
  .post(
    '/transfer-paypal-payment',
    // auth(USER_ROLE.USER),
    paymentController.transferPaypalPayment,
  )

  .get('/success', paymentController.successPage)
  .get('/cancel', paymentController.cancelPaymentPage)
  .get('/reniew-success', paymentController.reniewSuccessPage)
  .get('/reniew-cancel', paymentController.reniewCancelPaymentPage)

  .get(
    '/',
    // auth(USER_ROLE.ADMIN),
    paymentController.getAllPayment,
  )
  .get('/overview-all', paymentController.overviewAll)
  .get('/brand-engagement', paymentController.getBrandEngagement)
  .get('/all-income-rasio', paymentController.getAllIncomeRasio)
  .get(
    '/all-subsription-users-rasio',
    paymentController.getAllSubscrptionUserRasioBydays,
  )
  .get('/all-income-rasio-by-days', paymentController.getAllIncomeRasioBydays)
  .get(
    '/all-earning-rasio',
    auth(USER_ROLE.ADMIN),
    paymentController.getAllEarningRasio,
  )

  .get('/:id', paymentController.getSinglePayment)

  .delete('/:id', paymentController.deleteSinglePayment);

export default paymentRouter;











