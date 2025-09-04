import { model, Schema } from 'mongoose';
import { IProject } from './project.interface';

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
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
    title: { type: String, required: true },
    completedDate: { type: Date, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
);


export const Project = model<IProject>('Project', projectSchema);
