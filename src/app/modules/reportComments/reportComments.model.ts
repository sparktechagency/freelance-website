
import mongoose, { Schema} from 'mongoose';
import { TReportComments } from './reportComments.interface';

const reportCommentsSchema = new Schema<TReportComments>(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comments',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const ReportComments = mongoose.model<TReportComments>(
  'ReportComments',
  reportCommentsSchema,
);

export default ReportComments;
