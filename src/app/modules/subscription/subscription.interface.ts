import { Types } from "mongoose";

export type TSubscription = {
  duration: '1 month' | '3 months' | '6 months' | '1 year';
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  price: number;
  status: string;
  endDate: Date;
  meetCount: number;
  takeMeetCount: number;
  meetDuration: number;
  isDeleted: boolean;
};
