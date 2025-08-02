import { Types } from "mongoose";


export type TCarBooking = {
  carId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  // startTime: string;
  // endTime: string;
  facilities: string[];
  status: string;
  paymentStatus: string;
  bookingDate: Date;
  isDeleted: boolean;
};
