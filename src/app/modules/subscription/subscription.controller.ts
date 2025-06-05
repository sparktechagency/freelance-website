import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { subscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await subscriptionService.createSubscription(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Subscription Create successful!!',
  });
});

const getAllSubscription = catchAsync(async (req, res) => {
  const { meta, result } = await subscriptionService.getAllsubscriptionQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Subscription are requered successful!!',
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.getSingleSubscriptionQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Subscription are requered successful!!',
  });
});

const updateSingleSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await subscriptionService.updateSingleSubscriptionQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Subscription  are updated successful!!',
  });
});

const deleteSingleSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.deletedsubscriptionQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Subscription are successful!!',
  });
});

export const subscriptionController = {
  createSubscription,
  getAllSubscription,
  getSingleSubscription,
  updateSingleSubscription,
  deleteSingleSubscription,
};
