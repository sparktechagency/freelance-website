import Otp from './otp.model';
import { CreateOtpParams } from './otp.interface';
import AppError from '../../error/AppError';
import { verifyToken } from '../../utils/tokenManage';
import httpStatus from 'http-status';
import config from '../../config';
import { generateOptAndExpireTime } from './otp.utils';
import { otpSendEmail } from '../../utils/eamilNotifiacation';

const createOtp = async ({
  name,
  sentTo,
  receiverType,
  purpose,
  otp,
  expiredAt,
}: CreateOtpParams) => {
  // const expiredAtDate = new Date(expiredAt);
  const newOTP = new Otp({
    sentTo,
    receiverType,
    purpose,
    otp,
    expiredAt,
  });

  await newOTP.save();

  return newOTP;
};

const checkOtpByEmail = async (email: string) => {
  const isExist = await Otp.findOne({
    sentTo: email,
  });

  // console.log({ email });

  // console.log({ isExist });

  const isExpireOtp = await Otp.findOne({
    sentTo: email,
    expiredAt: { $lt: new Date() }, // Use the `$gt` operator for comparison
  });

  // console.log({ isExpireOtp });

  // console.log('.........');

  return { isExist, isExpireOtp };
};

// const otpMatch = async (email: string, otp: string) => {
//   console.log(email, otp);
//   const isOtpMatch = await Otp.findOne({
//     sentTo: email,
//     otp,
//     status: 'pending',
//     expiredAt: { $gt: new Date() },
//   });

//   console.log({ isOtpMatch });

//   return isOtpMatch;
// };

const otpMatch = async (email: string, otp: string) => {
  console.log(email, otp);

  // Query to find OTP record that matches email, otp, and status is 'pending'
  const otpRecord = await Otp.findOne({
    sentTo: email,
    otp,
  });

  // Handle case where OTP record doesn't exist
  if (!otpRecord) {
    console.log('OTP does not match');
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP does not match');
  }

  // Case 1: OTP is expired
  if (otpRecord.expiredAt < new Date()) {
    console.log('OTP is expired');
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP is expired');
  }

  // Case 2: OTP is already verified
  if (otpRecord.status === 'verified') {
    console.log('OTP is already verified');
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP is already verified');
  }

  // // Case 3: OTP matches and is valid (pending)
  // if (otpRecord.status === 'pending' && otpRecord.expiredAt < new Date()) {
  //   console.log('OTP match and not expired');
  //   throw new AppError(httpStatus.BAD_REQUEST, 'OTP is expired');
  // }

  // Default case: OTP does not match
  return otpRecord;
};


const updateOtpByEmail = async (
  email: string,
  payload: Record<string, any>,
) => {
  // console.log(payload);
  const otpUpdate = await Otp.findOneAndUpdate(
    {
      sentTo: email,
    },
    payload,
    { new: true },
  );

  return otpUpdate;
};

const resendOtpEmail = async ({ token }: { token: string }) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  const decodeData = verifyToken({
    token,
    access_secret: config.jwt_access_secret as string,
  });
  const { email } = decodeData;

  const { isExist, isExpireOtp } = await checkOtpByEmail(email);

  const { otp, expiredAt } = generateOptAndExpireTime();

  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token data is not valid !!');
  } else if (isExist && !isExpireOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Otp exist. Please check email.',
    );
  } else if (isExist && isExpireOtp) {
    const otpUpdateData = {
      otp,
      expiredAt,
    };

    await updateOtpByEmail(email, otpUpdateData);
  }

  process.nextTick(async () => {
    await otpSendEmail({
      sentTo: email,
      subject: 'Re-send your one time otp for email  verification',
      name: '',
      otp,
      expiredAt: expiredAt,
    });
  });
};

export const otpServices = {
  createOtp,
  checkOtpByEmail,
  otpMatch,
  updateOtpByEmail,
  resendOtpEmail,
};
