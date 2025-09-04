import { Date, Types } from "mongoose";

export interface IProject {
  userId: Types.ObjectId;
  name: string; 
  title: string; 
  completedDate:Date;
  description: string;
  image: string;
  isDeleted: boolean;
}
