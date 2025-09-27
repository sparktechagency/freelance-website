import { Types } from "mongoose";

export type TInvoices = {
  invoiceType: 'service' | 'tender';
  freelancerUserId: Types.ObjectId;
  clientUserId: Types.ObjectId;
  tenderId?: Types.ObjectId;
  serviceType: string;
  amount: number;
  date: Date;
  status: string;
  paymentStatus: string;
  deliveryMessage: string;
  deliveryFiles: string[];
  extendDate?: Date;
  
};