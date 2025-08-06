import { Schema, model, Types } from 'mongoose';
import { days, TDoctorAvailable } from './doctorAvailable.interface';

const daySchema = new Schema<days>({
  day: {
    type: String,
    required: true,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  lanchStartTime: { type: String, required: true },
  lanchEndTime: { type: String, required: true },
  bookingBreakTime: { type: Number, required: true },
});

const doctorAvailabilitySchema = new Schema<TDoctorAvailable>({
  doctorId: { type: Schema.Types.ObjectId, required: true, ref: 'Doctor' },
  availability: { type: [daySchema], required: true },
});

const DoctorAvailability = model<TDoctorAvailable>(
  'DoctorAvailability',
  doctorAvailabilitySchema,
);

export default DoctorAvailability;
