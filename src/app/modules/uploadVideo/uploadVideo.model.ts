import { model, Schema } from "mongoose";
import { TUploadVideo } from "./uploadVideo.interface";


const videos = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const uploadVideoSchema = new Schema<TUploadVideo>(
  {
    category: {
      type: String,
      required: true,
    },
    videos: {
      type: [videos],
      required: [true, 'Videos are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one File is required',
      },
    },
  },
  { timestamps: true },
);

const UploadVideo = model<TUploadVideo>('UploadVideo', uploadVideoSchema);
export default UploadVideo;
