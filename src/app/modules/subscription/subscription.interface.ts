import { Types } from "mongoose";

export type TSubscription = {
  type: string;
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
