import { Types } from "mongoose";

export type TSubscription = {
  type: string;
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  price: number;
  status: string;
  endDate: Date;
  videoCount: number;
  takeVideoCount: number;
  isDeleted: boolean;
  transactionId:string;
};
