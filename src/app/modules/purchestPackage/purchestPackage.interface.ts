import { Types } from 'mongoose';

export type TPurchestPackage = {
  type: string;
  userId: Types.ObjectId;
  packageId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  price: number;
  status: string;
  endDate: Date;
};
