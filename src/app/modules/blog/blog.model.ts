import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';

const faqSchema = new Schema<TBlog>({
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
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const Blog = model<TBlog>('Blog', faqSchema);
export default Blog;
