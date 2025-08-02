import { model, Schema } from "mongoose";
import { TCarBooking } from "./carBooking.interface";

const CarBookingSchema = new Schema<TCarBooking>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // startTime: {
    //   type: String,
    //   required: true,
    // },
    // endTime: {
    //   type: String,
    //   required: true,
    // },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      required: true,
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'unpaid'],
      required: true,
      default: 'pending',
    },
    facilities: {
      type: [String],
      ref: 'Facility',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);


const CarBooking = model<TCarBooking>(
  'CarBooking',
  CarBookingSchema,
);

export default CarBooking;
