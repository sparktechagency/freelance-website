import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { hireCreatorService } from './hireCreator.service';

const createHireCreator = catchAsync(async (req, res) => {
  const payload = req.body;
  const {userId} = req.user
  payload.userId = userId
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const result = await hireCreatorService.createHireCreator(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'HireCreator Create successful!!',
  });
});

const getAllHireCreator = catchAsync(async (req, res) => {
  const { meta, result } = await hireCreatorService.getAllHireCreatorQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All HireCreator are requered successful!!',
  });
});

const getAllHireCreatorByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } = await hireCreatorService.getAllHireCreatorByUserQuery(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All HireCreator are requered successful!!',
  });
});

const getSingleHireCreator = catchAsync(async (req, res) => {
  const result = await hireCreatorService.getSingleHireCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single HireCreator are requered successful!!',
  });
});

const updateSingleHireCreator = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await hireCreatorService.updateSingleHireCreatorQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single HireCreator  are updated successful!!',
  });
});


const approvedSingleHireCreator = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await hireCreatorService.approvedSingleHireCreator(
    id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Approved Single HireCreator are successful!!',
  });
});

const cancelSingleHireCreator = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await hireCreatorService.cancelSingleHireCreator(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Cancel Single HireCreator are successful!!',
  });
});

const assignTaskCreatorUploadVideosByCreator = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const result =
    await hireCreatorService.assignTaskCreatorUploadVideosByCreator(
      id,
      userId,
      imageFiles,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator  are upload Video successful!!',
  });
});

const assignTaskRevisionByUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const payload: any = {};
  if (req.query?.revisionText) {
    payload['revisionText'] = req.query.revisionText;
  }
  if (req.query?.status) {
    payload['status'] = req.query.status;
  }

  const result = await hireCreatorService.assignTaskRevisionByUser(
    id,
    userId,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator is successful!!',
  });
});

const assignTaskCreatorReSubmitUploadVideosByCreator = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const imageFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const result =
      await hireCreatorService.assignTaskCreatorReSubmitUploadVideosByCreator(
        id,
        userId,
        imageFiles,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Single AssignTaskCreator  are upload Video successful!!',
    });
  },
);

const deleteSingleHireCreator = catchAsync(async (req, res) => {
  const result = await hireCreatorService.deletedHireCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single HireCreator are successful!!',
  });
});

export const hireCreatorController = {
  createHireCreator,
  getAllHireCreator,
  getAllHireCreatorByUser,
  getSingleHireCreator,
  updateSingleHireCreator,
  approvedSingleHireCreator,
  cancelSingleHireCreator,
  assignTaskCreatorUploadVideosByCreator,
  assignTaskRevisionByUser,
  assignTaskCreatorReSubmitUploadVideosByCreator,
  deleteSingleHireCreator,
};
