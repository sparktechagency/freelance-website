import { Types } from "mongoose";
import { assign } from "nodemailer/lib/shared";

export type TAssignTaskCreator = {
  creatorId: Types.ObjectId;
  creatorUserId: Types.ObjectId;
  price: number;
  hireCreatorId: Types.ObjectId;
  hireCreatorUserId: Types.ObjectId;
  status: string;
  paymentStatus: string;
  uploadedFiles: {
    key: string;
    url: string;
  }[];
  isScript: string;
  videoCount: number;
};



