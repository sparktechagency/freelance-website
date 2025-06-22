import { model, Schema } from "mongoose";
import { TAssignTaskCreator } from "./assignTaskCreator.interface";

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
      enum: ['pending', 'request_approved', 'approved', 'cancel', 'revision', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const AssignTaskCreator = model<TAssignTaskCreator>(
  'AssignTaskCreator',
  assignTaskCreatorSchema,
);
export default AssignTaskCreator;