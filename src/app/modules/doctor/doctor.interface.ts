import { Types } from "mongoose";

export type days = {
    day: string;
    startTime: string;
    endTime: string;
    lanchStartTime: string;
    lanchEndTime: string;
    // bookingBreakTime: number;
};

export type TDoctor = {
  userId: Types.ObjectId;
  availability: [days];
  details: string;
  specialization: string;
  experience: string;
  workingPlace: string;
  documents: string[];
  isDeleted: boolean;
};

