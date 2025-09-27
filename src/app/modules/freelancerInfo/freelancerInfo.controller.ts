import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { freelancerinfoService } from './freelancerInfo.service';


const updateSingleFreelancerinfo = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const data = req.body;

  const { operation, ...payload }: any = data;

  const result = await freelancerinfoService.updateSingleFreelancerinfoQuery(
    userId,
    payload,
    operation,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Freelancerinfo  are updated successful!!',
  });
});

const deleteSingleFreelancerinfo = catchAsync(async (req, res) => {
  const result = await freelancerinfoService.deletedFreelancerinfoQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Freelancerinfo are successful!!',
  });
});

export const freelancerinfoController = {
  updateSingleFreelancerinfo,
  deleteSingleFreelancerinfo,
};
