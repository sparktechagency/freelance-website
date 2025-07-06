import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPurchestPackage } from './purchestPackage.interface';
import PurchestPackage from './purchestPackage.model';
import Package from '../package/package.model';
import { calculateEndDate } from './purchestPackage.utils';
import { BASE_URL, getPaypalAccessToken } from '../../utils/paypal';
import axios from 'axios';
import Subscription from '../subscription/subscription.model';
import { Payment } from '../payment/payment.model';

const createPurchestPackage = async (payload:any) => {
  console.log('package payload=', payload);

  // Check if subscriptionId or packageId are required based on type
  if (payload.type === 'subscription' && !payload.subscriptionId) {
    throw new AppError(403, 'Subscription id is required!!');
  }
  if (payload.type === 'package' && !payload.packageId) {
    throw new AppError(403, 'Package id is required!!');
  }

  // Fetch package if exists
  if (payload.packageId) {
    const existingPackage = await Package.findById(payload.packageId);
    if (!existingPackage) {
      throw new AppError(404, 'Package not found!');
    }
    payload.price = existingPackage.price;
  }

  console.log('sdfafafaf')
  console.log('payload.subscriptionId', payload.subscriptionId);

  // Fetch subscription if exists
  if (payload.subscriptionId) {
    const existingSubscription = await Subscription.findOne({_id: payload.subscriptionId})
    console.log('existingSubscription==', existingSubscription);
    if (!existingSubscription) {
      throw new AppError(404, 'Subscription not found!');
    }
    payload.price = existingSubscription.price;
    const days = existingSubscription.type === 'monthly' ? 30 : 365;
    const generateEndDate = calculateEndDate(new Date(), days);
    payload.endDate = generateEndDate;
  }

  // Ensure there's no running subscription
  const runningSubscription = await PurchestPackage.findOne({
    userId: payload.userId,
    status: 'running',
    type: 'subscription',
  });
  if (runningSubscription) {
    throw new AppError(403, 'You already have a running subscription!');
  }

//   // Get PayPal access token
//   const assecToken = await getPaypalAccessToken();
//   console.log('assecToken==', assecToken);

  try {
//     const order = await axios.post(
//       `${BASE_URL}/v2/checkout/orders`,
//       {
//         intent: 'CAPTURE',
//         purchase_units: [
//           {
//             amount: {
//               currency_code: 'USD',
//               value: '100',
//             },
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${assecToken}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log('order==', order);
//     console.log('order data==', order.data);
//     console.log('order data id==', order.data.id);

//     if (!order.data || !order.data.id) {
//       throw new AppError(400, 'Order creation failed.');
//     }

//     const capture = await axios.post(
//       `${BASE_URL}/v2/checkout/orders/${order.data.id}/capture`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${assecToken}`,
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log('capture==', capture);

//     if (!capture.data) {
//       throw new AppError(400, 'Capture failed.');
//     }

    // Create the purchase package record
    const result = await PurchestPackage.create(payload);

    if (!result) {
      throw new AppError(403, 'Subscription creation failed!');
    }

    const paymentData:any = {
      status: 'paid',
      amount: result.price,
      transactionId: 'dsdsdkklddd',
      userId: result.userId,
      transactionDate: new Date(),
    };

    if(result.type === 'subscription'){
      paymentData.subscriptionId = result._id;
    }else{
      paymentData.packageId = result._id;
    }

    const payment = await Payment.create(paymentData);

    if (!payment) {
      throw new AppError(403, 'payment creation failed!');
    }   

  const updateResult =  await PurchestPackage.findByIdAndUpdate(
      result._id,
      {status: 'running'},
      { new: true },
    );
    

    return updateResult;
  } catch (error) {
    console.error('Error during payment or package creation', error);
    throw new AppError(500, 'Payment processing failed.');
  }
};

const getAllPurchestPackageQuery = async (query: Record<string, unknown>) => {
  const subscriptionQuery = new QueryBuilder(PurchestPackage.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await subscriptionQuery.modelQuery;

  const meta = await subscriptionQuery.countTotal();
  return { meta, result };
};

const getSinglePurchestPackageQuery = async (id: string) => {
  const ScreateSubscription: any = await PurchestPackage.findById(id);
  if (!ScreateSubscription) {
    throw new AppError(404, 'Subscription Not Found!!');
  }
  return ScreateSubscription;
};

const updateSinglePurchestPackageQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const ScreateSubscriptionProduct: any = await PurchestPackage.findById(id);
  if (!ScreateSubscriptionProduct) {
    throw new AppError(404, 'Subscription is not found!');
  }

  const result = await PurchestPackage.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'Subscription updated faild!!');
  }

  return result;
};

const deletedPurchestPackageQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const subscription = await PurchestPackage.findById(id);
  if (!subscription) {
    throw new AppError(404, 'Subscription Not Found!!');
  }

  const result = await PurchestPackage.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Subscription Result Not Found !');
  }

  return result;
};

export const purchestPackageService = {
  createPurchestPackage,
  getAllPurchestPackageQuery,
  getSinglePurchestPackageQuery,
  updateSinglePurchestPackageQuery,
  deletedPurchestPackageQuery,
};
