import { Schema, model, Types } from 'mongoose';
import { days, TDoctor } from './doctor.interface';

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
  // bookingBreakTime: { type: Number, required: true },
});

const doctorSchema = new Schema<TDoctor>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  availability: { type: [daySchema], required: false },
  specialization: { type: String, required: false, default: null },
  experience: { type: String, required: false, default: null },
  workingPlace: { type: String, required: false, default: null },
  details: { type: String, required: false, default: null },
  documents: {
    type: [String],
    required: [false, 'Images are required'],
    // validate: {
    //   validator: function (value: string[]) {
    //     return value && value.length > 0;
    //   },
    //   message: 'At least one image is required',
    // },
  },
  isDeleted: { type: Boolean, default: false },
});

const Doctor = model<TDoctor>('Doctor', doctorSchema);

export default Doctor;
