import { model, Schema } from "mongoose";
import { TCar } from "./car.interface";

const carSchema = new Schema<TCar>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: {
      type: [String],
      required: [true, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    facility: { type: [String], required: true },
    location: { type: String, required: true },
    ratings: { type: Number, required: true, default: 0 },
    reviews: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Create the TCar Model
const Car = model<TCar>('Car', carSchema);

export default Car;
