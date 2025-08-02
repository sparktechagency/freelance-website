import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import Car from './car.model';
import AppError from '../../error/AppError';
import { carService } from './car.service';

const createCar = catchAsync(async (req, res) => {
  const payload = req.body;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  
  if (imageFiles?.images && imageFiles.images.length > 0) {
    payload.images = imageFiles.images.map((file) =>
      file.path.replace(/^public[\\/]/, ''),
    );
  }
  payload.price = Number(payload.price);

  const result = await carService.createCar(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Car Create successful!!',
  });
});

const getAllCar = catchAsync(async (req, res) => {
  const { meta, result } = await carService.getAllCarQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Car are requered successful!!',
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const result = await carService.singleCar(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Car are requered successful!!',
  });
});


const updateSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  let remainingUrl = updateData?.remainingUrl || null;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  if (imageFiles?.images && imageFiles.images.length > 0) {
    updateData.images = imageFiles.images.map((file) =>
      file.path.replace(/^public[\\/]/, ''),
    );
  }

  const carExist = await Car.findById(id);
  if (!carExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }


  if (remainingUrl) {
    if (!updateData.images) {
      updateData.images = [];
    }
    updateData.images = [...updateData.images, remainingUrl];
  }

  if (updateData.images) {
    updateData.images = [...carExist.images, ...updateData.images];
  }

  updateData.price = Number(updateData.price);

  console.log('updateData', updateData);

  const result = await carService.updateSingleCar(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Car are updated successful!!',
  });
});

const deleteSingleCar = catchAsync(async (req, res) => {
  const result = await carService.deleteSingleCar(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Car are successful!!',
  });
});

export const carController = {
  createCar,
  getAllCar,
  getSingleCar,
  updateSingleCar,
  deleteSingleCar
};
