import { Schema, model } from 'mongoose';
import { TArticle } from './article.interface'; 

const articleSchema = new Schema<TArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
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
    publicationDate: {
      type: Date,
      required: true,
    },
    sourseName: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Article = model<TArticle>('Article', articleSchema);

export default Article;
