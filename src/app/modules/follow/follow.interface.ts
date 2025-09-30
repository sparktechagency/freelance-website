import { Types } from "mongoose";

export type TFollow = {
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
};
