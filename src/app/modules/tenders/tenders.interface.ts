import { Date, Types } from "mongoose";

export interface ITenders {
  userId: Types.ObjectId;
  title: string;
  image: string;
  startDate: Date;
  endDate: Date;
  description: string;
  categoryId: string;
  categoryName: string;
  serviceTypeId: string;
  serviceTypeName: string;
  isDeleted: boolean;
}
