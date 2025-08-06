import { Types } from "mongoose";

export type TDoctorBooking = {
  userId: Types.ObjectId;
  doctorId: Types.ObjectId;
  bookingDate:Date;
  startTime: string;
  endTime: string;
  status: string;
};

