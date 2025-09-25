import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { TPayment } from './payment.interface';
import { Payment } from './payment.model';
import QueryBuilder from '../../builder/QueryBuilder';
import moment from 'moment';
import Stripe from 'stripe';
import httpStatus from 'http-status';
import config from '../../config';
import mongoose from 'mongoose';
import { StripeAccount } from '../stripeAccount/stripeAccount.model';
import { withdrawService } from '../withdraw/withdraw.service';
import { Withdraw } from '../withdraw/withdraw.model';
import cron from 'node-cron';
import { notificationService } from '../notification/notification.service';
import axios from 'axios';
import paypalClient from '../../utils/paypal';
import paypal from '@paypal/checkout-server-sdk';
import * as paypalPayouts from '@paypal/payouts-sdk';
import Subscription from '../subscription/subscription.model';
import Invoice from '../invoices/invoices.model';
import { Tender } from '../tenders/tenders.model';
import Package from '../package/package.model';
import { calculateEndDate } from '../subscription/subcription.utils';

type SessionData = Stripe.Checkout.Session;

// console.log({ first: config.stripe.stripe_api_secret });

export const stripe = new Stripe(
  config.stripe.stripe_api_secret as string,
  //      {
  //   apiVersion: '2024-09-30.acacia',
  // }
);

// console.log('stripe==', stripe);

const addPaymentService = async (payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(payload.userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    const paymentData = {
      userId: user._id,
      method: payload.method,
      status: 'paid',
      transactionId: payload.transactionId,
      transactionDate: new Date(),
    };

    const payment = await Payment.create([paymentData], { session });

    await session.commitTransaction();
    session.endSession();
    return payment;
  } catch (error) {
    console.error('Transaction Error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const subscriptionRenewal = async (userId: string, subscriptionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }


    const subscription = await Subscription.findById(subscriptionId).session(session);

    if (!subscription) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Subscription not found');
    }

    if(subscription.userId.toString() !== userId.toString()){
      throw new AppError(httpStatus.BAD_REQUEST, 'You are not authorized to renew this subscription');
    }

    const existingRunningSubscription = await Subscription.findOne({
      userId: userId,
      type: subscription.type,
      title: subscription.title,
      packageId: subscription.packageId,
      endDate: { $gt: new Date() },
      $expr: { $lt: ['$takeTenderCount', '$tenderCount'] },
      status: 'running',
      isDeleted: false,
    }).session(session);

    console.log('existingRunningSubscription==', existingRunningSubscription);

    if (existingRunningSubscription) {
      throw new AppError(
        400,
        'Your subscription is already running! Please check your profile.',
      );
    }

    const paymentData = {
      amount: subscription.price,
      subscriptionId: subscription._id,
      type:"renewal",
    };
        
    
        const url = await paymentService.createCheckout(user._id, paymentData);

    await session.commitTransaction();
    session.endSession();
    return url;
  } catch (error) {
    console.error('Transaction Error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// const checkPayoutStatus = async (batchId: string) => {
//   try {
//     // Create a GET request to retrieve the payout status
//     const payoutStatusRequest = new paypalPayouts.payouts.PayoutsGetRequest(
//       batchId,
//     );

//     // Execute the request
//     const response = await paypalClient.execute(payoutStatusRequest);

//     // Check if the response is successful
//     if (response.statusCode === 200) {
//       // Log the current status of the payout
//       console.log('Payout Status:', response.result.batch_header.batch_status);

//       // Handle different batch statuses
//       switch (response.result.batch_header.batch_status) {
//         case 'SUCCESS':
//           console.log('Payout was successful!');
//           break;
//         case 'PENDING':
//           console.log('Payout is still processing.');
//           break;
//         case 'FAILED':
//           console.error('Payout failed.');
//           break;
//         default:
//           console.log('Payout status is unknown.');
//       }

//       return response.result;
//     } else {
//       console.error('Failed to fetch payout status.');
//       throw new Error('Failed to fetch payout status');
//     }
//   } catch (error:any) {
//     console.error('Error checking payout status:', error.message);
//     throw new Error('Error checking payout status');
//   }
// };

const getAllPaymentService = async (query: Record<string, unknown>) => {
  const PaymentQuery = new QueryBuilder(
    Payment.find({}).populate({path:'userId', select: 'fullName profile email role'}),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();
  return { meta, result };
};

const getAllPaymentServiceReveniew = async (query: Record<string, unknown>) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const year = query.year;

  const response = await axios.get(
    `${config.hospitable_api_url}/transactions?page=${page}&per_page=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${config.hospitable_api_key}`,
      },
    },
  );

  // console.log('response.data', response?.data?.data);
  // console.log('year', year);
  //   if (year) {
  //     const filteredData = response?.data?.data?.filter((transaction: any) => {
  //       const transactionDate = new Date(transaction?.date);
  //       return transactionDate.getFullYear() === year;
  //     });

  //     console.log('filteredData', filteredData);

  //     return {meta:response?.data?.meta, result:filteredData} ;
  //   }

  return { meta: response?.data?.meta, result: response?.data?.data };
};

const getAllPaymentByCustomerService = async (
  query: Record<string, unknown>,
  customerId: string,
) => {
  const PaymentQuery = new QueryBuilder(
    Payment.find({ customerId, status: 'paid' }).populate({
      path: 'serviceId',
      select: 'serviceName servicePrice',
      populate: { path: 'businessId', select: 'businessName' },
    }),
    // .populate('businessId'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();
  return { meta, result };
};

const singlePaymentService = async (id: string) => {
  const task = await Payment.findById(id);
  return task;
};

const deleteSinglePaymentService = async (id: string) => {
  const result = await Payment.deleteOne({ _id: id });
  return result;
};

const getAllIncomeRatio = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalIncome: 0,
  }));

  // console.log({ months });

  const incomeData = await Payment.aggregate([
    {
      $match: {
        transactionDate: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$transactionDate' } },
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        month: '$_id.month',
        totalIncome: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    const monthData = months.find((m) => m.month === data.month);
    if (monthData) {
      monthData.totalIncome = data.totalIncome;
    }
  });

  // console.log({ months });

  return months;
};

const getAllOverview = async () => {
  const totalFreelancer = await User.countDocuments({ role: 'freelancer' });
  const totalClient = await User.countDocuments({ role: 'client' });
  const totalAcceptProject = await Invoice.countDocuments({
    status: 'accepted',
  });
  const totalUsers = await User.countDocuments({});
  const totalDeliveryProject = await User.countDocuments({
    status: 'completed',
  });
  const totalRevenueFromSubscription = await Payment.aggregate([
    {
      $match: { status: 'paid', paymentType: 'subscription' },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
      },
    },
  ]);


  const totalRevenueFromProject = await Payment.aggregate([
    {
      $match: { 
        status: 'paid', 
        paymentType: 'invoice'
       },
    },
    {
      $project: {
        amount: 1,
        revenue: { $multiply: ['$amount', 0.05] }, 
      },
    },
    {
      $group: {
        _id: null, 
        totalRevenue: { $sum: '$revenue' },
      },
    },
  ]);

  const totalRevenue =
    totalRevenueFromSubscription[0]?.totalIncome +
    totalRevenueFromProject[0]?.totalRevenue;


    const totalRevenueLast7DaysForInvoice = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paymentType: 'invoice',
          transactionDate: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Filter for last 7 days
          },
        },
      },
      {
        $project: {
          amount: 1,
          revenue: { $multiply: ['$amount', 0.05] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
        },
      },
    ]);

    const totalRevenueLast7DaysForSubscription = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paymentType: 'subscription',
          transactionDate: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Filter for last 7 days
          },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
        },
      },
    ]);

    const last7DaysEarning =
      totalRevenueLast7DaysForInvoice[0]?.totalRevenue +
      totalRevenueLast7DaysForSubscription[0]?.totalIncome || 0;


    const dailyDeliveriesLast7Days = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)), 
          },
          status: 'completed',
        },
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
      },
      {
        $group: {
          _id: '$date', 
          totalDeliveries: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

  
    const last7DaysDeliveries = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const existingDay = dailyDeliveriesLast7Days.find(
        (item) => item._id === dateString,
      );
      last7DaysDeliveries.push({
        dateHour: dateString,
        totalDeliveries: existingDay ? existingDay.totalDeliveries : 0,
      });
    }

    console.log(last7DaysDeliveries);


    const totalActiveProjects = await Invoice.find({ status: 'accepted' });


     

  return {
    totalUsers,
    totalFreelancer,
    totalClient,
    totalAcceptProject,
    totalDeliveryProject,
    totalRevenue,
    last7DaysEarning,
    last7DaysTotalDeliveryAcceptProject: last7DaysDeliveries,
    totalActiveProjects,
  };
};


// const getAllIncomeRatiobyDays = async (days: string) => {
//   const currentDay = new Date();
//   let startDate: Date;

//   if (days === '7day') {
//     startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
//   } else if (days === '24hour') {
//     startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
//   } else {
//     throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
//   }

//   const timeSlots =
//     days === '7day'
//       ? Array.from({ length: 7 }, (_, i) => {
//           const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
//           return {
//             date: day.toISOString().split('T')[0],
//             totalIncome: 0,
//           };
//         }).reverse()
//       : Array.from({ length: 24 }, (_, i) => {
//           const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
//           return {
//             hour: hour.toISOString(),
//             totalIncome: 0,
//           };
//         }).reverse();

//   const incomeData = await Payment.aggregate([
//     {
//       $match: {
//         transactionDate: { $gte: startDate, $lte: currentDay },
//       },
//     },
//     {
//       $group: {
//         _id:
//           days === '7day'
//             ? {
//                 date: {
//                   $dateToString: {
//                     format: '%Y-%m-%d',
//                     date: '$transactionDate',
//                   },
//                 },
//               }
//             : {
//                 hour: {
//                   $dateToString: {
//                     format: '%Y-%m-%dT%H:00:00',
//                     date: '$transactionDate',
//                   },
//                 },
//               },
//         totalIncome: { $sum: '$amount' },
//       },
//     },
//     // {
//     //   $project: {
//     //     dateHour: days === '7day' ? '$_id.date' : null,
//     //     dateHour: days === '24hour' ? '$_id.hour' : null,
//     //     totalIncome: 1,
//     //     _id: 0,
//     //   },
//     // },
//     {
//   $project: {
//     dateHour: {
//       $cond: {
//         if: { $eq: [days, '7day'] },
//         then: '$_id.date', // For 7day, use the date field
//         else: '$_id.hour', // For 24hour, use the hour field
//       },
//     },
//     totalIncome: 1,
//     _id: 0,
//   },
// },
//     {
//       $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
//     },
//   ]);

//   incomeData.forEach((data) => {
//     if (days === '7day') {
//       const dayData = timeSlots.find((d: any) => d.date === data.date);
//       if (dayData) {
//         dayData.totalIncome = data.totalIncome;
//       }
//     } else if (days === '24hour') {
//       const hourData = timeSlots.find((h: any) => h.hour === data.hour);
//       if (hourData) {
//         hourData.totalIncome = data.totalIncome;
//       }
//     }
//   });

//   return timeSlots;
// };

const getAllIncomeRatiobyDays = async (days: string) => {
  const currentDay = new Date();
  let startDate: Date;

  if (days === '7day') {
    startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (days === '24hour') {
    startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
  } else {
    throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
  }

  const timeSlots =
    days === '7day'
      ? Array.from({ length: 7 }, (_, i) => {
          const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
          return {
            dateHour: day.toISOString().split('T')[0],
            totalIncome: 0,
          };
        }).reverse()
      : Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
          return {
            dateHour: hour.toISOString(),
            totalIncome: 0,
          };
        }).reverse();

  const incomeData = await Payment.aggregate([
    {
      $match: {
        transactionDate: { $gte: startDate, $lte: currentDay },
      },
    },
    {
      $group: {
        _id:
          days === '7day'
            ? {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transactionDate',
                  },
                },
              }
            : {
                hour: {
                  $dateToString: {
                    format: '%Y-%m-%dT%H:00:00',
                    date: '$transactionDate',
                  },
                },
              },
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        dateHour: days === '7day' ? '$_id.date' : '$_id.hour', // Rename to 'dateHour'
        totalIncome: 1,
        _id: 0,
      },
    },
    {
      $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    if (days === '7day') {
      const dayData = timeSlots.find((d: any) => d.dateHour === data.dateHour);
      if (dayData) {
        dayData.totalIncome = data.totalIncome;
      }
    } else if (days === '24hour') {
      const hourData = timeSlots.find((h: any) => h.dateHour === data.dateHour);
      if (hourData) {
        hourData.totalIncome = data.totalIncome;
      }
    }
  });

  return timeSlots;
};

const getAllSubscriptionUsersByWeekly = async (days: string) => {
  const currentDay = new Date();
  let startDate: Date;

  if (days === '7day') {
    startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (days === '24hour') {
    startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
  } else {
    throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
  }

  const timeSlots =
    days === '7day'
      ? Array.from({ length: 7 }, (_, i) => {
          const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
          return {
            dateHour: day.toISOString().split('T')[0],
            totalUsers: 0,
          };
        }).reverse()
      : Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
          return {
            dateHour: hour.toISOString(),
            totalUsers: 0,
          };
        }).reverse();

  const incomeData = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: currentDay },
      },
    },
    {
      $group: {
        _id:
          days === '7day'
            ? {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transactionDate',
                  },
                },
              }
            : {
                hour: {
                  $dateToString: {
                    format: '%Y-%m-%dT%H:00:00',
                    date: '$transactionDate',
                  },
                },
              },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        dateHour: days === '7day' ? '$_id.date' : '$_id.hour',
        totalUsers: 1,
        _id: 0,
      },
    },
    {
      $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    if (days === '7day') {
      const dayData = timeSlots.find((d: any) => d.dateHour === data.dateHour);
      if (dayData) {
        dayData.totalUsers = data.totalUsers;
      }
    } else if (days === '24hour') {
      const hourData = timeSlots.find((h: any) => h.dateHour === data.dateHour);
      if (hourData) {
        hourData.totalUsers = data.totalUsers;
      }
    }
  });

  return timeSlots;
};

const getFreelancerClientsCountryRegion = async () => {
  const result = await User.aggregate([
    {
      $facet: {
        freelancers: [
          {
            $match: { role: 'freelancer' },
          },
          {
            $group: {
              _id: '$location',
              freelancerCount: { $sum: 1 },
            },
          },
          {
            $project: {
              country: '$_id',
              freelancerCount: 1,
              _id: 0,
            },
          },
        ],
        clients: [
          {
            $match: { role: 'client' },
          },
          {
            $group: {
              _id: '$location',
              clientCount: { $sum: 1 },
            },
          },
          {
            $project: {
              country: '$_id',
              clientCount: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        freelancers: 1,
        clients: 1,
      },
    },
  ]);

  
  const combinedResult = {
    freelancers: result[0].freelancers,
    clients: result[0].clients,
  };

  return combinedResult;
};


const createCheckout = async (userId: any, payload: any) => {
  console.log('stripe payment', payload);
  let session = {} as { id: string };

  const metaData: any = {
    userId: String(userId),
  };
  if (payload.subscriptionId && !payload.type)
    metaData.subscriptionId = String(payload.subscriptionId);
  if (payload.invoiceId && !payload.type) metaData.invoiceId = String(payload.invoiceId);

  if (payload.subscriptionId && payload.type) {
    metaData.subscriptionId = String(payload.subscriptionId);
    metaData.type = String(payload.type);
  }

  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Amount',
        },
        unit_amount: Math.round(payload.amount * 100),
      },
      quantity: 1,
    },
  ];

  const sessionData: any = {
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: config.stripe.stripe_payment_success_url,
    cancel_url: config.stripe.stripe_payment_cancel_url,
    line_items: lineItems,
    // subscription_data: {
    //   metadata: {
    //     userId: String(userId),
    //     packageId: String(isExistPackage._id),
    //   },
    // },
    metadata: metaData,
  };

  console.log('sessionData=', sessionData);
  console.log('metaData=', metaData);

  try {
    console.log('try session');
    session = await stripe.checkout.sessions.create(sessionData);
  } catch (error) {
    console.log('Error', error);
  }

  console.log('try session 22');
  const { id: session_id, url }: any = session || {};

  console.log({ url });

  return { url };
};


const automaticCompletePayment = async (event: Stripe.Event): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log(
          'hit hise webhook controller servie checkout.session.completed',
        );
        const sessionData = event.data.object as Stripe.Checkout.Session;
        const {
          id: sessionId,
          payment_intent: paymentIntentId,
          metadata,
        }: SessionData = sessionData;
        console.log('metadata==', metadata);
        const subcriptionId = metadata?.subscriptionId as string;
        const invoiceId = metadata?.invoiceId as string;
        const userId = metadata?.userId as string;
        const type = metadata?.type as string;

        if (!paymentIntentId) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment Intent ID not found in session',
          );
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId as string,
        );

        if (!paymentIntent || paymentIntent.amount_received === 0) {
          throw new AppError(httpStatus.BAD_REQUEST, 'Payment Not Successful');
        }

        console.log('===subcriptionId', subcriptionId);

        if (subcriptionId && !type) {
          console.log('******************************************************subscriptionid and not type');
          const subscription = await Subscription.findById(subcriptionId);
          console.log('===subscription', subscription);
          const subscriptionUpdated = await Subscription.findByIdAndUpdate(
            subcriptionId,
            { status: 'running' },
            { new: true, session },
          );
          if (!subscriptionUpdated) {
            console.log('===subscriptionUpdated', subscriptionUpdated);
          }

          const purchestPackage = await Package.findById(subscription?.packageId);

          if (!purchestPackage) {
            console.log('===purchestPackage', purchestPackage);
          }

          const paymentData: any = {
            userId: userId,
            amount: subscription?.price,
            method: 'stripe',
            transactionId: paymentIntentId,
            subcriptionId: subscription?._id,
            status: 'paid',
            sessionId: sessionId,
            paymentType: 'subscription',
            // transactionDate: subscription?.createdAt,
          };

          const payment = await Payment.create([paymentData], { session });
          console.log('===payment', payment);
          if (payment.length === 0) {
            console.log('===payment.length', payment);
          }

          if (purchestPackage?.isBadge){
            await User.findByIdAndUpdate(
              userId,
              { isVarified: true },
              { session },
            );
          }
            await Subscription.deleteMany(
              { userId, status: 'pending' },
              { session },
            );
        } else if (invoiceId && !type) {
         console.log(
           '******************************************************invoiceId and not type',
         );
          const invoice: any = await Invoice.findById(invoiceId);
          console.log('===invoice', invoice);
          const invoiceUpdated = await Invoice.findByIdAndUpdate(
            invoiceId,
            { status: 'accepted' },
            { new: true, session },
          );
          if (!invoiceUpdated) {
            console.log('===invoiceUpdated', invoiceUpdated);
          }

          const mainTender:any = await Tender.findById(invoice.tenderId).session(
            session,
          );
          if (!mainTender) {
           console.log('tender not found!!');
          }

          const updateTender = await Tender.findByIdAndUpdate(
            mainTender._id,
            { status: 'running' },
            { new: true, session },
          );

          if (!updateTender) {
            // throw new AppError(403, 'Tender update failed!');
            console.log('Tender update failed');
          }
          // 5% of amount minuse main amount
          // const fee = (5 * invoice?.amount) / 100;
          // const totalAmount = invoice?.amount - fee;

          const totalAmountPayment = paymentIntent.amount_received / 100;
          // minuse 7% of amount
          const feePayment = (7 * totalAmountPayment);
          const totalAmountPaymentFinal = totalAmountPayment - feePayment;

          const paymentData: any = {
            userId: userId,
            amount: totalAmountPayment,
            method: 'stripe',
            transactionId: paymentIntentId,
            invoiceId: invoice?._id,
            status: 'paid',
            sessionId: sessionId,
            paymentType: 'invoice',
            transferAmount: totalAmountPaymentFinal,
            // transactionDate: subscription?.createdAt,
          };

          const payment = await Payment.create([paymentData], { session });
          console.log('===payment', payment);
          if (payment.length === 0) {
            console.log('===payment', payment);
          }

          if (invoice?.tenderId) {
            const deleteOtherInvoice = await Invoice.updateMany(
              { tenderId: invoice?.tenderId, status: 'pending' },
              { status: 'declined' },
              { session },
            );
          }
        }else if(subcriptionId && type){
         console.log(
           '******************************************************subscriptionid and  type',
         );
           const subscription: any = await Subscription.findById(subcriptionId);
           console.log('===subscription', subscription);
           const days = subscription.type === 'monthly' ? 30 : 365;
           const generateEndDate = calculateEndDate(new Date(), days);
           const myRemainingTenderCount =
             subscription.tenderCount - subscription.takeTenderCount;
           const subscriptionUpdated = await Subscription.findByIdAndUpdate(
             subcriptionId,
             {
               status: 'running',
               endDate: generateEndDate,
               tenderCount: myRemainingTenderCount + 5,
               takeTenderCount: 0,
             },
             { new: true, session },
           );
           if (!subscriptionUpdated) {
             console.log('===subscriptionUpdated', subscriptionUpdated);
           }

           const purchestPackage = await Package.findById(
             subscription?.packageId,
           );

           if (!purchestPackage) {
             console.log('===purchestPackage', purchestPackage);
           }

           const paymentData: any = {
             userId: userId,
             amount: subscription?.price,
             method: 'stripe',
             transactionId: paymentIntentId,
             subcriptionId: subscription?._id,
             status: 'paid',
             sessionId: sessionId,
             paymentType: 'renewal',
             // transactionDate: subscription?.createdAt,
           };

           const payment = await Payment.create([paymentData], { session });
           console.log('===payment', payment);
           if (payment.length === 0) {
             console.log('===payment.length', payment);
           }

           if (purchestPackage?.isBadge) {
             await User.findByIdAndUpdate(
               userId,
               { isVarified: true },
               { session },
             );
           }
           
           if (purchestPackage?.isSupport) {
             await User.findByIdAndUpdate(
               userId,
               { isSupported: true },
               { session },
             );
           }
        }



        const user = await User.findById(userId);
        if (!user) {
          throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
        }

        const notificationData = {
          userId: userId,
          message: 'Subscription create successfull!!',
          type: 'success',
        };

        const notificationData1 = {
          role: 'admin',
          message: 'New Booking create successfull!!',
          type: 'success',
        };

        const [notification, notification1] = await Promise.all([
          notificationService.createNotification(notificationData),
          notificationService.createNotification(notificationData1),
        ]);

        if (!notification || !notification1) {
          throw new AppError(404, 'Notification create faild!!');
        }

        await session.commitTransaction();
        console.log('Payment completed successfully:', {
          sessionId,
          paymentIntentId,
        });

        break;
      }

      case 'checkout.session.async_payment_failed': {
        const sessionData = event.data.object as Stripe.Checkout.Session;
        const {
          id: sessionId,
          payment_intent: paymentIntentId,
          metadata,
        }: SessionData = sessionData;
        const subcriptionId = metadata?.subcriptionId as string;
        const userId = metadata?.userId as string;

        await Subscription.deleteMany(
          { userId, status: 'pending' },
          { session },
        );

        await session.commitTransaction();
        break;
      }

      default:
        // // console.log(`Unhandled event type: ${event.type}`);
        // res.status(400).send();
        return;
    }
  } catch (err) {
    await session.abortTransaction();
    console.error('Error processing webhook event:', err);
  } finally {
    session.endSession();
  }
};



// const paymentRefundService = async (
//   amount: number | null,
//   payment_intent: string,
// ) => {
//   const refundOptions: Stripe.RefundCreateParams = {
//     payment_intent,
//   };

//   // Conditionally add the `amount` property if provided
//   if (amount) {
//     refundOptions.amount = Number(amount);
//   }

//   // console.log('refaund options', refundOptions);

//   const result = await stripe.refunds.create(refundOptions);
//   // console.log('refund result ', result);
//   return result;
// };

// const getAllEarningRatio = async (year: number) => {
//   const startOfYear = new Date(year, 0, 1);
//   const endOfYear = new Date(year + 1, 0, 1);

//   const months = Array.from({ length: 12 }, (_, i) => ({
//     month: i + 1,
//     totalIncome: 0,
//   }));

//   // console.log({ months });

//   const incomeData = await Payment.aggregate([
//     {
//       $match: {
//         status: 'paid',
//         transactionDate: { $gte: startOfYear, $lt: endOfYear },
//       },
//     },
//     {
//       $group: {
//         _id: { month: { $month: '$transactionDate' } },
//         totalIncome: { $sum: '$amount' },
//       },
//     },
//     {
//       $project: {
//         month: '$_id.month',
//         totalIncome: 1,
//         _id: 0,
//       },
//     },
//     {
//       $sort: { month: 1 },
//     },
//   ]);

//   incomeData.forEach((data) => {
//     const monthData = months.find((m) => m.month === data.month);
//     if (monthData) {
//       monthData.totalIncome = data.totalIncome;
//     }
//   });

//   return months;
// };


const getAllEarningRatio = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalIncome: 0,
  }));

  const incomeData = await Payment.aggregate([
    {
      $match: {
        status: 'paid',
        transactionDate: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $project: {
        month: { $month: '$transactionDate' },
        amount: 1,
        paymentType: 1, 
      },
    },
    {
      $addFields: {
        revenue: {
          $cond: {
            if: { $eq: ['$paymentType', 'invoice'] }, 
            then: { $multiply: ['$amount', 0.05] }, 
            else: '$amount',
          },
        },
      },
    },
    {
      $group: {
        _id: { month: '$month' },
        totalIncome: { $sum: '$revenue' },
      },
    },
    {
      $project: {
        month: '$_id.month',
        totalIncome: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    const monthData = months.find((m) => m.month === data.month);
    if (monthData) {
      monthData.totalIncome = data.totalIncome;
    }
  });

  return months;
};


const refreshAccountConnect = async (
  id: string,
  host: string,
  protocol: string,
): Promise<string> => {
  const onboardingLink = await stripe.accountLinks.create({
    account: id,
    refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${id}`,
    return_url: `${protocol}://${host}/api/v1/payment/success-account/${id}`,
    type: 'account_onboarding',
  });
  return onboardingLink.url;
};

const createStripeAccount = async (
  user: any,
  host: string,
  protocol: string,
): Promise<any> => {
  // console.log('user',user);
  const existingAccount = await StripeAccount.findOne({
    userId: user.userId,
  }).select('user accountId isCompleted');
  // console.log('existingAccount', existingAccount);

  if (existingAccount) {
    if (existingAccount.isCompleted) {
      return {
        success: false,
        message: 'Account already exists',
        data: existingAccount,
      };
    }

    const onboardingLink = await stripe.accountLinks.create({
      account: existingAccount.accountId,
      refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${existingAccount.accountId}`,
      return_url: `${protocol}://${host}/api/v1/payment/success-account/${existingAccount.accountId}`,
      type: 'account_onboarding',
    });
    // console.log('onboardingLink-1', onboardingLink);

    return {
      success: true,
      message: 'Please complete your account',
      url: onboardingLink.url,
    };
  }

  const account = await stripe.accounts.create({
    type: 'express',
    email: user.email,
    country: 'US',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  // console.log('stripe account', account);

  await StripeAccount.create({ accountId: account.id, userId: user.userId });

  const onboardingLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${account.id}`,
    return_url: `${protocol}://${host}/api/v1/payment/success-account/${account.id}`,
    type: 'account_onboarding',
  });
  // console.log('onboardingLink-2', onboardingLink);

  return {
    success: true,
    message: 'Please complete your account',
    url: onboardingLink.url,
  };
};

const transferBalanceService = async (
  accountId: string,
  amt: number,
) => {
  // const withdreawAmount = await availablewithdrawAmount('stripe', userId);
  // // console.log('withdreawAmount===', withdreawAmount[0].totalAmount);

  // if (withdreawAmount[0].totalAmount < 0) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Amount must be positive');
  // }
  const amount =Number(amt) * 100;
  const transfer = await stripe.transfers.create({
    amount,
    currency: 'usd',
    destination: accountId,
  });
  // console.log('transfer', transfer);
  if (!transfer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transfer failed');
  }

  return "Transfer successful";
  // let withdraw;
  // if (transfer) {
  //   const withdrawData: any = {
  //     transactionId: transfer.id,
  //     amount: withdreawAmount[0].totalAmount,
  //     method: 'stripe',
  //     status: 'completed',
  //     businessId: userId,
  //     destination: transfer.destination,
  //   };

  //   withdraw = withdrawService.addWithdrawService(withdrawData);
  //   if (!withdraw) {
  //     throw new AppError(httpStatus.BAD_REQUEST, 'Withdrawal failed');
  //   }
  // }
  // return withdraw;
};


// 0 0 */7 * *

// cron.schedule('* * * * *', async () => {
//   // console.log('Executing transferBalanceService every 7 days...');
//   const businessUser = await User.find({
//     role: 'business',
//     isDeleted: false,
//   });
//   // console.log('businessUser==', businessUser);

//   for (const user of businessUser) {
//     // console.log('usr=====');
//     const isExiststripeAccount:any = await StripeAccount.findOne({
//       userId: user._id,
//       isCompleted: true,
//     });
//     // console.log('isExiststripeAccount', isExiststripeAccount);

//     if (!isExiststripeAccount) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Account not found');
//     }

//      // console.log('=====1')
//     await transferBalanceService(
//       isExiststripeAccount.accountId,
//       0,
//       isExiststripeAccount.userId,
//     );
//     // console.log('=====2');
//   }

//   // await transferBalanceService();
// });

export const paymentService = {
  addPaymentService,
  subscriptionRenewal,
  getAllPaymentService,
  getAllPaymentServiceReveniew,
  singlePaymentService,
  deleteSinglePaymentService,
  getAllPaymentByCustomerService,
  getAllIncomeRatio,
  getAllOverview,
  getAllSubscriptionUsersByWeekly,
  getFreelancerClientsCountryRegion,
  getAllIncomeRatiobyDays,
  createCheckout,
  automaticCompletePayment,
  getAllEarningRatio,
  //   paymentRefundService,
  //   filterBalanceByPaymentMethod,
  //   filterWithdrawBalanceByPaymentMethod,
    createStripeAccount,
    refreshAccountConnect,
    transferBalanceService,
};
