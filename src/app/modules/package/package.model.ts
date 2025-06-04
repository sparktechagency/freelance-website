import { model, Schema } from "mongoose";
import { TPackage } from "./package.interface";

const TBenefits = {
    type: String,
    required: true
}

const faqSchema = new Schema<TPackage>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  subtitle: {
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
      message: 'At least one File is required',
    },
  },
  price: {
    type: Number,
    required: true,
  },
  benefits: [TBenefits],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Package = model<TPackage>('Package', faqSchema);
export default Package;
