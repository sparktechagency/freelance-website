import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  method: string;
  amount: Number;
  status: string;
  transactionId: string;
  transactionDate: Date;
  subscriptionId?: Types.ObjectId;
  type: string;
  isRefund: boolean;
};
