import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { invoiceService } from './invoices.service';

const createInvoice = catchAsync(async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  payload.freelancerUserId = userId;
  
  const result = await invoiceService.createInvoice(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Invoice Create successful!!',
  });
});


const createInvoiceChatBoot = catchAsync(async (req, res) => {
  const prompt = req.body.prompt;

  const result = await invoiceService.createInvoiceChatBoot(prompt);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'ChatBoot Invoice successful!!',
  });
});

const getAllInvoiceByClient = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const { meta, result } = await invoiceService.getAllInvoiceByClientQuery(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'All Invoice are requered successful!!',
  });
});

const getAllInvoices = catchAsync(async (req, res) => {
  const { meta, result } = await invoiceService.getAllInvoices(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'All Invoice are requered successful!!',
  });
});


const getAllInvoiceByFreelancer = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } = await invoiceService.getAllInvoiceByFreelancerQuery(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Invoice are requered successful!!',
  });
});

const getSingleInvoice = catchAsync(async (req, res) => {
  const result = await invoiceService.getSingleInvoiceQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Invoice are requered successful!!',
  });
});

const updateSingleInvoice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

 

  const result = await invoiceService.updateSingleInvoiceQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Invoice  are updated successful!!',
  });
});


const invoiceApprove = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const {id} = req.params;

  const result = await invoiceService.invoiceApprove(userId, id );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Invoice Approve are successful!!',
  });
});


const invoiceDelivery = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const payload = req.body;
  payload.freelancerUserId = userId;

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if(!payload.deliveryMessage){
    throw new Error('Delivery Message is required');
    
  }

  const result = await invoiceService.invoiceDelivery(id, payload, files);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Invoice Delivery are successful!!',
  });
});


const invoiceComplete = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await invoiceService.invoiceComplete(userId, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Invoice Complete are successful!!',
  });
});

const deleteSingleInvoice = catchAsync(async (req, res) => {
  const result = await invoiceService.deletedInvoiceQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Invoice are successful!!',
  });
});

export const invoiceController = {
  createInvoice,
  createInvoiceChatBoot,
  getAllInvoiceByClient,
  getAllInvoices,
  getAllInvoiceByFreelancer,
  invoiceApprove,
  invoiceDelivery,
  invoiceComplete,
  getSingleInvoice,
  updateSingleInvoice,
  deleteSingleInvoice,
};
