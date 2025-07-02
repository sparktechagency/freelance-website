import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { assignTaskCreatorService } from './assignTaskCreator.service';

const createAssignTaskCreator = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await assignTaskCreatorService.createAssignTaskCreator(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'AssignTaskCreator Create successful!!',
  });
});

const getAllAssignTaskCreator = catchAsync(async (req, res) => {
  const { meta, result } = await assignTaskCreatorService.getAllAssignTaskCreatorQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All AssignTaskCreator are requered successful!!',
  });
});

const getAssignTaskCreatorByCreatorOrUser = catchAsync(async (req, res) => {
    const { userId } = req.user;
  const { meta, result } =
    await assignTaskCreatorService.getAllAssignTaskCreatorOfUserQuery(
      req.query,
      userId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All AssignTaskCreator are requered successful!!',
  });
});

const getSingleAssignTaskCreator = catchAsync(async (req, res) => {
  const result = await assignTaskCreatorService.getSingleAssignTaskCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator are requered successful!!',
  });
});

const getSingleHireCreatorToAssignTaskCreator = catchAsync(async (req, res) => {
  const result =
    await assignTaskCreatorService.getSingleHireCreatorToAssignTaskCreator(
      req.params.id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator are requered successful!!',
  });
});

const singleAssignTaskCreatorApprovedCancel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const status = req.query.status;
  const { userId } = req.user;

  const result =
    await assignTaskCreatorService.singleAssignTaskCreatorApprovedCancelQuery(
      id,
      status,
      userId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator  are updated successful!!',
  });
});


const singleAssignTaskCreatorApprovedByAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await assignTaskCreatorService.singleAssignTaskCreatorApprovedByAdmin(
      id
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single AssignTaskCreator  are Approved successful!!',
  });
});

// const assignTaskCreatorUploadVideosByCreator = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.user;
//   const imageFiles = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };

//   const result =
//     await assignTaskCreatorService.assignTaskCreatorUploadVideosByCreator(
//       id,
//       userId,
//       imageFiles,
//     );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Single AssignTaskCreator  are upload Video successful!!',
//   });
// });

// const assignTaskRevisionByUser = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.user;
//   const payload:any = {};
//   if(req.query?.revisionText){
//     payload['revisionText'] = req.query.revisionText;
//   }
//   if (req.query?.status) {
//     payload['status'] = req.query.status;
//   }

//   const result = await assignTaskCreatorService.assignTaskRevisionByUser(
//     id,
//     userId,
//     payload,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Single AssignTaskCreator is successful!!',
//   });
// });


// const assignTaskCreatorReSubmitUploadVideosByCreator = catchAsync(
//   async (req, res) => {
//     const { id } = req.params;
//     const { userId } = req.user;
//     const imageFiles = req.files as {
//       [fieldname: string]: Express.Multer.File[];
//     };

//     const result =
//       await assignTaskCreatorService.assignTaskCreatorReSubmitUploadVideosByCreator(
//         id,
//         userId,
//         imageFiles,
//       );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       data: result,
//       message: 'Single AssignTaskCreator  are upload Video successful!!',
//     });
//   },
// );

const deleteSingleAssignTaskCreator = catchAsync(async (req, res) => {
    const {userId} = req.user
  const { id } = req.params;
  const result = await assignTaskCreatorService.deletedAssignTaskCreatorQuery(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single AssignTaskCreator are successful!!',
  });
});

export const assignTaskCreatorController = {
  createAssignTaskCreator,
  getAllAssignTaskCreator,
  getAssignTaskCreatorByCreatorOrUser,
  getSingleAssignTaskCreator,
  getSingleHireCreatorToAssignTaskCreator,
  singleAssignTaskCreatorApprovedCancel,
  singleAssignTaskCreatorApprovedByAdmin,
  // assignTaskCreatorUploadVideosByCreator,
  // assignTaskRevisionByUser,
  // assignTaskCreatorReSubmitUploadVideosByCreator,
  deleteSingleAssignTaskCreator,
};
