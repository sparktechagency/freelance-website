import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TSubscription } from './subscription.interface';
import Subscription from './subscription.model';

const createSubscription = async (payload: TSubscription) => {
  console.log('Subscription payload=', payload);

  const result = await Subscription.create(payload);

  if (!result) {
    throw new AppError(403, 'Subscription create faild!!');
  }

  return result;
};

const getAllsubscriptionQuery = async (query: Record<string, unknown>) => {
  const subscriptionQuery = new QueryBuilder(Subscription.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await subscriptionQuery.modelQuery;

  const meta = await subscriptionQuery.countTotal();
  return { meta, result };
};

const getSingleSubscriptionQuery = async (id: string) => {
  const ScreateSubscription: any = await Subscription.findById(id);
  if (!ScreateSubscription) {
    throw new AppError(404, 'Subscription Not Found!!');
  }
  return ScreateSubscription;
};

const updateSingleSubscriptionQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const ScreateSubscriptionProduct: any = await Subscription.findById(id);
  if (!ScreateSubscriptionProduct) {
    throw new AppError(404, 'Subscription is not found!');
  }

  const result = await Subscription.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'Subscription updated faild!!');
  }

  return result;
};

const deletedsubscriptionQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new AppError(404, 'Subscription Not Found!!');
  }

  const result = await Subscription.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Subscription Result Not Found !');
  }

  return result;
};

export const subscriptionService = {
  createSubscription,
  getAllsubscriptionQuery,
  getSingleSubscriptionQuery,
  updateSingleSubscriptionQuery,
  deletedsubscriptionQuery,
};
