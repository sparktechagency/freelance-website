import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  method: string;
  amount: Number;
  status: string;
  transactionId: string;
  transactionDate: Date;
  packageId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
};
