import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { propertyService } from './properties.service';

const createProperties = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await propertyService.createProperty();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Properties Create successful!!',
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  // const { meta, result } = await propertyService.getAllPropertyQuery();

  const { meta, result } = await propertyService.getAllPropertyQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Properties are requered successful!!',
  });
});

const getSingleProperties = catchAsync(async (req, res) => {
  const result = await propertyService.getSinglePropertyQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Properties are requered successful!!',
  });
});

const updateSingleProperties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await propertyService.updateSinglePropertyQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Properties  are updated successful!!',
  });
});

const deleteSingleProperties = catchAsync(async (req, res) => {
  const result = await propertyService.deletedPropertyQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Properties are successful!!',
  });
});


export const propertiesController = {
  createProperties,
  getAllProperties,
  getSingleProperties,
  updateSingleProperties,
  deleteSingleProperties,
};
