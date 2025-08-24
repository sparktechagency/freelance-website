import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { subscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req, res) => {
  const payload = req.body;
 const {userId} = req.user;
 payload.userId = userId;

  const result = await subscriptionService.createSubscription(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Subscription Create successful!!',
  });
});

const getAllMySubscription = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result:any= await subscriptionService.getAllMysubscriptionQuery(
    req.query,
    userId,
  );
  // console.log('result controller' ,result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result?.meta || null,
    data: result && result.result ? result.result : result,
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

const getExistSubscription = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await subscriptionService.getSubscrptionExistSubscriptionQuery(
    userId
  );

  console.log('result controller' ,result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Subscriptionq are requered successful!!',
  });
});

const updateSingleSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result = await subscriptionService.updateSingleSubscriptionQuery(
    id,
    imageFiles,
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
  getAllMySubscription,
  getSingleSubscription,
  getExistSubscription,
  updateSingleSubscription,
  deleteSingleSubscription,
};
