import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { paymentService, stripe } from './payment.service';
import sendResponse from '../../utils/sendResponse';
import Stripe from 'stripe';
import AppError from '../../error/AppError';
import config from '../../config';
import paypalClient from '../../utils/paypal';
import { StripeAccount } from '../stripeAccount/stripeAccount.model';
import paypal from '@paypal/checkout-server-sdk';
import { Payment } from './payment.model';
import { Request, Response } from 'express';
import { deleteFromS3 } from '../../utils/s3';
import mongoose from 'mongoose';
import { cancelTemplete, successAccountTemplete, successTemplete } from '../../../templete/templete';
import { notificationService } from '../notification/notification.service';
import { User } from '../user/user.models';


const addPayment = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const orderData = req.body;
  orderData.userId = userId;

  const result = await paymentService.addPaymentService(orderData);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment Successfull!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});



const subscriptionRenewal = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const subscriptionId = req.params.id;

  const result = await paymentService.subscriptionRenewal(
    userId,
    subscriptionId,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Subscription Renewal Successfull!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});


const getAllPayment = catchAsync(async (req, res, next) => {
  const result = await paymentService.getAllPaymentService(req.query);
  // // console.log('result',result)

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment are retrived Successfull!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getAllPaymentReveniew = catchAsync(async (req, res, next) => {
  const result = await paymentService.getAllPaymentServiceReveniew(req.query);
  // // console.log('result',result)

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment are retrived Successfull!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getAllPaymentByCustormer = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  console.log('customer id', userId); 
  const result = await paymentService.getAllPaymentByCustomerService(
    req.query,
    userId,
  );
  // // console.log('result',result)
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'My Payment are retrived Successfull!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getSinglePayment = catchAsync(async (req, res, next) => {
  const result = await paymentService.singlePaymentService(req.params.id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Payment are retrived Successfull!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const deleteSinglePayment = catchAsync(async (req, res, next) => {
  // give me validation data
  const result = await paymentService.deleteSinglePaymentService(req.params.id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Delete Payment Successfull!!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getAllIncomeRasio = catchAsync(async (req, res) => {
  const yearQuery = req.query.year;

  // Safely extract year as string
  const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;

  if (!year || isNaN(year)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid year provided!',
      data: {},
    });
  }

  const result = await paymentService.getAllIncomeRatio(year);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Income All Ratio successful!!',
  });
});


const overviewAll = catchAsync(async (req, res) => {
  const result = await paymentService.getAllOverview();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'All Overview successful!!',
  });
});



const getAllSubscrptionUserRasioBydays = catchAsync(async (req, res) => {
  const { days }: any = req.query;

  const result = await paymentService.getAllSubscriptionUsersByWeekly(days);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Subscription users All Ratio successful!!',
  });
});


const getFreelancerClientsCountryRegion = catchAsync(async (req, res) => {
  
  const result = await paymentService.getFreelancerClientsCountryRegion();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Clients freelancer country regions successful!!',
  });
});


const getAllIncomeRasioBydays = catchAsync(async (req, res) => {
  const { days }: any = req.query;

  const result = await paymentService.getAllIncomeRatiobyDays(days);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Income All Ratio successful!!',
  });
});

//payment

const successPage = async (req: Request, res: Response) => {
  res.send(successTemplete);
};

const cancelPaymentPage = async (req: Request, res: Response) => {
  res.send(cancelTemplete);
};



const successPageAccount = catchAsync(async (req, res) => {
  // console.log('payment account hit hoise');
  const { id } = req.params;
  // console.log('user id ', req.user.userId);
  const account = await stripe.accounts.update(id, {});
  // console.log('account', account);

  if (
    account?.requirements?.disabled_reason &&
    account?.requirements?.disabled_reason.indexOf('rejected') > -1
  ) {
    return res.redirect(
      `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
    );
  }
  if (
    account?.requirements?.disabled_reason &&
    account?.requirements?.currently_due &&
    account?.requirements?.currently_due?.length > 0
  ) {
    return res.redirect(
      `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
    );
  }
  if (!account.payouts_enabled) {
    return res.redirect(
      `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
    );
  }
  if (!account.charges_enabled) {
    return res.redirect(
      `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
    );
  }
  // if (account?.requirements?.past_due) {
  //     return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refreshAccountConnect/${id}`);
  // }
  if (
    account?.requirements?.pending_verification &&
    account?.requirements?.pending_verification?.length > 0
  ) {
    // return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refreshAccountConnect/${id}`);
  }
  const getUser = await StripeAccount.findOne({ accountId: id});
  await StripeAccount.updateOne({ accountId: id }, { isCompleted: true });
  await User.updateOne({ _id: getUser!.userId }, { isStripeConnectedAccount: true });  

res.send(successAccountTemplete);
});

//webhook

const createCheckout = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await paymentService.createCheckout(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment initialized',
    data: result,
  });
});

const conformWebhook = catchAsync(async (req, res) => {
  // console.log('wabook hit hoise controller')
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;
  try {
    // Verify the event using Stripe's library
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.WEBHOOK,
    );

    await paymentService.automaticCompletePayment(event);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    // res.status(400).send('Webhook Error');
    throw new AppError(httpStatus.BAD_REQUEST, 'Webhook Error');
    // return;
  }
});




const getAllEarningRasio = catchAsync(async (req, res) => {
  const yearQuery = req.query.year;

  // Safely extract year as string
  const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;

  if (!year || isNaN(year)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid year provided!',
      data: {},
    });
  }

  const result = await paymentService.getAllEarningRatio(year);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Earning All Ratio successful!!',
  });
});

// const paymentRefund = catchAsync(async (req, res) => {
//   const { amount, payment_intent } = req.body;
//   // console.log('refaund data', req.body);
//   const result = await paymentService.paymentRefundService(
//     amount,
//     payment_intent,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Payment Refund Successfull',
//     data: result,
//   });
// });



// const getAllEarningByPaymentMethod = catchAsync(async (req, res) => {
//   const { userId } = req.user;

//   const result = await paymentService.filterBalanceByPaymentMethod(userId);
//   // console.log('result', result);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result ? result : 0,
//     message: 'Earning All balance  successful!!',
//   });
// });



const refreshAccountConnect = catchAsync(async (req, res) => {
  const { id } = req.params;
  const url = await paymentService.refreshAccountConnect(
    id,
    req.get('host') || '',
    req.protocol,
  );
  res.redirect(url);
});

const createStripeAccount = catchAsync(async (req, res) => {
  const result = await paymentService.createStripeAccount(
    req.user,
    req.get('host') || '',
    req.protocol,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stripe account created',
    data: result,
  });
});

// const transferBalance = catchAsync(async (req, res) => {
//   const { accountId, amount } = req.body;
//   const { userId } = req.user;
//   const result = await paymentService.transferBalanceService(
//     accountId,
//     amount,
//     userId,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Transfer balance success',
//     data: result,
//   });
// });

export const paymentController = {
  addPayment,
  subscriptionRenewal,
  getAllPayment,
  getAllPaymentReveniew,
  getSinglePayment,
  deleteSinglePayment,
  getAllPaymentByCustormer,
  getAllIncomeRasio,
  overviewAll,
  getAllIncomeRasioBydays,
  getAllSubscrptionUserRasioBydays,
  getFreelancerClientsCountryRegion,
  createCheckout,
  conformWebhook,
  successPage,
  cancelPaymentPage,
  getAllEarningRasio,
    successPageAccount,
    // paymentRefund,
  //   getAllEarningByPaymentMethod,
  //   getAllWithdrawEarningByPaymentMethod,
    createStripeAccount,
    refreshAccountConnect,
    // transferBalance,
};
