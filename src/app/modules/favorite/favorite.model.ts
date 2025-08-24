import mongoose, { Schema} from 'mongoose';
import { TfavoriteProduct } from './favorite.interface';


const favoriteProductSchema: Schema = new Schema<TfavoriteProduct>(
  {
    type: {
      type: String,
      enum: ['course', 'article'],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
      default: null,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);


const FavoriteProduct = mongoose.model<TfavoriteProduct>(
  'FavoriteProduct',
  favoriteProductSchema,
);

export default FavoriteProduct;
