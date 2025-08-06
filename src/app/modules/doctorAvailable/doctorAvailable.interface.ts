import { Types } from "mongoose";

export type days = {
    day: string;
    startTime: string;
    endTime: string;
    lanchStartTime: string;
    lanchEndTime: string;
    bookingBreakTime: number;
};

export type TDoctorAvailable = {
  doctorId: Types.ObjectId;
  availability: [days];
};

