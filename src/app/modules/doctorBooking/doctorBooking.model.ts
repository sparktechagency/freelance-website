import { Schema, model } from 'mongoose';
import { TDoctorBooking } from './doctorBooking.interface'; 

const doctorBookingSchema = new Schema<TDoctorBooking>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
  doctorId: { type: Schema.Types.ObjectId, required: true, ref: 'Doctor' }, 
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'booked', 'cancelled'], default: 'pending' },
});

const DoctorBooking = model<TDoctorBooking>(
  'DoctorBooking',
  doctorBookingSchema,
);

export default DoctorBooking;
