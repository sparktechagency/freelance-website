import { model, Schema } from "mongoose";
import { TAssignTaskCreator } from "./assignTaskCreator.interface";


const uploads = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const assignTaskCreatorSchema = new Schema<TAssignTaskCreator>(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: true },
    creatorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    hireCreatorId: {
      type: Schema.Types.ObjectId,
      ref: 'HireCreator',
      required: true,
    },
    hireCreatorUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'request_approved',
        'approved',
        'cancel',
        'revision',
        'completed',
        'delivered',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    uploadedFiles: {
      type: [uploads],
      default: [],
      required: false,
    },
    isScript: {
      type: String,
      required: false,
      default: null,
    },
    videoCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);

const AssignTaskCreator = model<TAssignTaskCreator>(
  'AssignTaskCreator',
  assignTaskCreatorSchema,
);
export default AssignTaskCreator;