import express from 'express';
import { paymentController } from './payment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const paymentRouter = express.Router();

paymentRouter
  .post(
    '/add-payment',
    auth(USER_ROLE.FREELANCER),
    paymentController.addPayment,
  )
  .post(
    '/create-stripe-account',
    auth(USER_ROLE.FREELANCER),
    paymentController.createStripeAccount,
  )
  .get('/success', paymentController.successPage)
  .get('/cancel', paymentController.cancelPaymentPage)
  .get(
    '/',
    // auth(USER_ROLE.ADMIN),
    paymentController.getAllPayment,
  )
  //hospitable api start
  .get('/reveniew', paymentController.getAllPaymentReveniew)
  //hospitable api end
  .get('/overview-all', paymentController.overviewAll)
  .get('/all-income-rasio', paymentController.getAllIncomeRasio)
  .get(
    '/all-subsription-users-rasio',
    paymentController.getAllSubscrptionUserRasioBydays,
  )
  .get(
    '/freelancer-clients-country-region',
    paymentController.getFreelancerClientsCountryRegion,
  )
  .get('/all-income-rasio-by-days', paymentController.getAllIncomeRasioBydays)
  .get(
    '/all-earning-rasio',
    // auth(USER_ROLE.ADMIN),
    paymentController.getAllEarningRasio,
  )

  .get('/:id', paymentController.getSinglePayment)

  .delete('/:id', paymentController.deleteSinglePayment);

export default paymentRouter;











