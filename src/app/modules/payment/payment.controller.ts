import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { paymentService, stripe } from './payment.service';
import sendResponse from '../../utils/sendResponse';
import Stripe from 'stripe';
import AppError from '../../error/AppError';
import config from '../../config';
import paypalClient from '../../utils/paypal';
// import { StripeAccount } from '../stripeAccount/stripeAccount.model';
import paypal from '@paypal/checkout-server-sdk';
import HireCreator from '../hireCreator/hireCreator.model';
import { Payment } from './payment.model';
import Subscription from '../subscription/subscription.model';
import { Request, Response } from 'express';
import { deleteFromS3 } from '../../utils/s3';
import mongoose from 'mongoose';
import { cancelTemplete, successTemplete } from '../../../templete/templete';
import { calculateEndDate } from '../subscription/subcription.utils';


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


const createPaypalPayment = catchAsync(async (req, res, next) => {
  // const { userId } = req.user;
  // const orderData = req.body;
  // orderData.userId = userId;
  const result = await paymentService.createPaypalPaymentService(req.body);
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


const reniewPaypalPayment = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const {id} = req.params;
  // const orderData = req.body;
  // orderData.userId = userId;
  const result = await paymentService.reniewPaypalPaymentService(id, userId);
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reniew Payment Successfull!!',
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


const refundPaypalPayment = catchAsync(async (req, res, next) => {
  const captureId = req.body.captureId;
  const amount = req.body.amount;
  const result = await paymentService.refundPaypalPaymentService(
    captureId,
    amount,
  );
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refund Payment Successfull!!',
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
  const { token }: any = req.query;
  const { orderId }: any = req.query;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const request = new paypal.orders.OrdersGetRequest(token);
    const orderResponse = await paypalClient.execute(request);

    if (orderResponse.result.status !== 'APPROVED') {
      throw new Error('Payment not completed');
    }

    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    const captureResponse = await paypalClient.execute(captureRequest);

    if (captureResponse.result.status !== 'COMPLETED') {
      throw new Error('Payment capture failed');
    }

    const updateHireCreator: any = await HireCreator.findByIdAndUpdate(
      orderId,
      { status: 'pending', paymentStatus: 'paid' },
      { new: true, session },
    );

    if (!updateHireCreator) {
      throw new Error('HireCreator update failed!');
    }


    const paymentData = {
      userId: updateHireCreator.userId,
      method: 'paypal',
      amount: Number(
        captureResponse.result.purchase_units[0].payments.captures[0].amount
          .value,
      ),
      status: 'paid',
      transactionId: captureResponse.result.id,
      transactionDate: new Date(),
      subscriptionId: updateHireCreator.subscriptionId,
      
    };
    console.log('payment data', paymentData);

    const payment = await Payment.create([paymentData], { session });
    console.log('payment', payment);
    if (!payment) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment not created!');
    }
    await session.commitTransaction(); 
    res.send(successTemplete);

  } catch (error) {
    await session.abortTransaction();
    if (orderId) {
      const updateHireCreator = await HireCreator.findById(orderId);

      if (updateHireCreator) {
        await HireCreator.findByIdAndDelete(orderId, { session });
        await Subscription.findOneAndDelete(
          {
            userId: updateHireCreator.userId,
            _id: updateHireCreator.subscriptionId,
          },
          { session },
        );

        const key =
          updateHireCreator.contentInfo.ugcPhoto.split('amazonaws.com/')[1];

        const deleteImage: any = await deleteFromS3(key);
        console.log('deleteImage', deleteImage);
        if (!deleteImage) {
          throw new AppError(404, 'Do not Image Deleted!');
        }
      }
    }

    res.status(500).send('An error occurred while processing the payment.');
  }finally{
    session.endSession();
  }
};

const cancelPaymentPage = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId }: any = req.query;
    console.log('orderId', orderId);

    if (!orderId) {
      throw new Error('Order ID is required.');
    }

    const updateHireCreator: any =
      await HireCreator.findById(orderId).session(session);

    if (!updateHireCreator) {
      throw new Error('Order not found.');
    }

    const deleteSubscription = await Subscription.findOneAndDelete({
      userId: updateHireCreator.userId,
      _id: updateHireCreator.subscriptionId,
    }).session(session);

    if (!deleteSubscription) {
      console.log('No subscription found for the given orderId.');
    }

    const deleteHireCreator =
      await HireCreator.findByIdAndDelete(orderId).session(session);

    if (!deleteHireCreator) {
      console.log('No HireCreator found to delete for the given orderId.');
    }

    const key =
      updateHireCreator.contentInfo.ugcPhoto.split('amazonaws.com/')[1];

    const deleteImage: any = await deleteFromS3(key);
    console.log('deleteImage', deleteImage);
    if (!deleteImage) {
      throw new AppError(404, 'Do not Image Deleted!');
    }
    await session.commitTransaction();
    res.send(cancelTemplete);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during cancellation:', error);

    res
      .status(500)
      .send('An error occurred while processing the cancellation.');
  }
};


// reniew
const reniewSuccessPage = async (req: Request, res: Response) => {
  const { token }: any = req.query;
  const { subscriptionId }: any = req.query;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = new paypal.orders.OrdersGetRequest(token);
    const orderResponse = await paypalClient.execute(request);

    if (orderResponse.result.status !== 'APPROVED') {
      throw new Error('Payment not completed');
    }

    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    const captureResponse = await paypalClient.execute(captureRequest);

    if (captureResponse.result.status !== 'COMPLETED') {
      throw new Error('Payment capture failed');
    }

    const isExistSubscription = await Subscription.findById(subscriptionId);

    if (!isExistSubscription) {
      throw new AppError(404, 'Subscription is not found!!');
    }

     const days = isExistSubscription.type === 'monthly' ? 30 : 365;
          const generateEndDate = calculateEndDate(new Date(), days);

    const updateSubscription: any = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { endDate: generateEndDate },
      { new: true, session },
    );

    if (!updateSubscription) {
      throw new Error('Subscription update failed!');
    }

    const paymentData = {
      userId: isExistSubscription.userId,
      method: 'paypal',
      amount: Number(
        captureResponse.result.purchase_units[0].payments.captures[0].amount
          .value,
      ),
      status: 'paid',
      transactionId: captureResponse.result.id,
      transactionDate: new Date(),
      subscriptionId: isExistSubscription._id,
      type:"reniew"
    };
    console.log('payment data', paymentData);

    const payment = await Payment.create([paymentData], { session });
    console.log('payment', payment);
    if (payment.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment not created!');
    }
    await session.commitTransaction();
    res.send(successTemplete);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).send('Something is wrong!!');
  } finally {
    session.endSession();
  }
};


const reniewCancelPaymentPage = async (req: Request, res: Response) => {
  res.send(cancelTemplete);
};


// const successPageAccount = catchAsync(async (req, res) => {
//   // console.log('payment account hit hoise');
//   const { id } = req.params;
//   const account = await stripe.accounts.update(id, {});
//   // console.log('account', account);

//   if (
//     account?.requirements?.disabled_reason &&
//     account?.requirements?.disabled_reason.indexOf('rejected') > -1
//   ) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   if (
//     account?.requirements?.disabled_reason &&
//     account?.requirements?.currently_due &&
//     account?.requirements?.currently_due?.length > 0
//   ) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   if (!account.payouts_enabled) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   if (!account.charges_enabled) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   // if (account?.requirements?.past_due) {
//   //     return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refreshAccountConnect/${id}`);
//   // }
//   if (
//     account?.requirements?.pending_verification &&
//     account?.requirements?.pending_verification?.length > 0
//   ) {
//     // return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refreshAccountConnect/${id}`);
//   }
//   await StripeAccount.updateOne({ accountId: id }, { isCompleted: true });

// res.send(successAccountTemplete);
// });

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
  const { userId } = req.user;

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

  const result = await paymentService.getAllEarningRatio(year, userId);

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



// const refreshAccountConnect = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const url = await paymentService.refreshAccountConnect(
//     id,
//     req.get('host') || '',
//     req.protocol,
//   );
//   res.redirect(url);
// });

// const createStripeAccount = catchAsync(async (req, res) => {
//   const result = await paymentService.createStripeAccount(
//     req.user,
//     req.get('host') || '',
//     req.protocol,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Stripe account created',
//     data: result,
//   });
// });

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
  createPaypalPayment,
  reniewPaypalPayment,
  refundPaypalPayment,
  getAllPayment,
  getSinglePayment,
  deleteSinglePayment,
  getAllPaymentByCustormer,
  getAllIncomeRasio,
  getAllIncomeRasioBydays,
  createCheckout,
  conformWebhook,
  successPage,
  cancelPaymentPage,
  reniewSuccessPage,
  reniewCancelPaymentPage,
  getAllEarningRasio,
  //   successPageAccount,
  //   paymentRefund,
  //   getAllEarningByPaymentMethod,
  //   getAllWithdrawEarningByPaymentMethod,
  //   createStripeAccount,
  //   refreshAccountConnect,
  //   transferBalance,
};
