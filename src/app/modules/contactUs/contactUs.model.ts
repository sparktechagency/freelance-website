import { model, Schema } from "mongoose";
import { TContactUs } from "./contactUs.interface";

const contactUsSchema = new Schema<TContactUs>({
    fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum:['pending', 'solved'],
    default:"pending"
  }
},{timestamps:true});

const ContactUs = model<TContactUs>('ContactUs', contactUsSchema);
export default ContactUs;