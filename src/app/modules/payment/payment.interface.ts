import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  method: string;
  amount: Number;
  status: string;
  transactionId: string;
  transactionDate: Date;
  subcriptionId?: Types.ObjectId;
  sessionId?: string;
  isRefund: boolean;
};
