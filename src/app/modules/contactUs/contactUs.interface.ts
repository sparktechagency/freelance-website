import { Types } from 'mongoose';

export type TContactUs = {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  status:string;
};
