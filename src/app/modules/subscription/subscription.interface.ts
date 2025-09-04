import { Types } from "mongoose";

export type TSubscription = {
  type: string;
  title: string;
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  price: number;
  status: string;
  endDate: Date;
  tenderCount: number | string;
  takeTenderCount: number;
  isDeleted: boolean;
};
