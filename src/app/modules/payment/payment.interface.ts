import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  method: string;
  amount: Number;
  status: string;
  transactionId: string;
  transactionDate: Date;
  subcriptionId?: Types.ObjectId;
  invoiceId?: Types.ObjectId;
  paymentType: string;
  transferAmount: number;
  isRefund: boolean;
};
