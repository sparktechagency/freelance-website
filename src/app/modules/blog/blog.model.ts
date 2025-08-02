import { model, Schema } from 'mongoose';
import { TBlog, TBlogSection } from './blog.interface';

const addBlogSectionSchema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Blog',
    },
    subTitle: {
      type: String,
      required: true,
    },
    subDetails: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const blogSchema = new Schema<TBlog>(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);



const Blog = model<TBlog>('Blog', blogSchema);
const BlogSection = model<TBlogSection>('BlogSection', addBlogSectionSchema);
export { Blog, BlogSection };
