import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { contactUsService } from './contactUs.service';

const createContactUs = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await contactUsService.createContactUs(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'ContactUs Create successful!!',
  });
});

const getAllContactUs = catchAsync(async (req, res) => {
  const { meta, result } = await contactUsService.getAllContactUsQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All ContactUs are requered successful!!',
  });
});

const singleContactUs = catchAsync(async (req, res) => {
    const id = req.params.id as string;
  const result = await contactUsService.singleContactUs(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Contact us requered successful!!',
  });
});
const singleStatusContactUs = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await contactUsService.singleStatusContactUs(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Contact us solved successful!!',
  });
});

const singleDeleteContactUs = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await contactUsService.singleDeleteContactUs(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Delete Single Contact us successful!!',
  });
});

export const contactUsController = {
  createContactUs,
  getAllContactUs,
  singleContactUs,
  singleStatusContactUs,
  singleDeleteContactUs,
};
