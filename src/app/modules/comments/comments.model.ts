
import mongoose, { Schema} from 'mongoose';


const replyCommentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', 
    },
  ],
  commentsReply: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment', 
    },
  ],
});


const commentsSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  commentsReply: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments',
    },
  ],
},{timestamps:true});

// const Comment = mongoose.model('Comment', CommentSchema);
const Comments = mongoose.model('Comments', commentsSchema);

export default Comments;
