import { model, Schema } from "mongoose";
import { TFacility } from "./facility.interface";

const facilitySchema = new Schema<TFacility>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const Facility = model<TFacility>('Facility', facilitySchema);
export default Facility;