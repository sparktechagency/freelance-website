import { Date, Types } from "mongoose";

export interface IJobs {
  userId: Types.ObjectId;
  title: string;
  image: string;
  jobType: string;
  websiteLink: string;
  startDate: Date;
  endDate: Date;
  description: string;
  categoryId: string;
  categoryName: string;
  serviceTypeId: string;
  serviceTypeName: string;
  isDeleted: boolean;
}
