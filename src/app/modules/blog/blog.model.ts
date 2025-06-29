import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';


const videos = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const blogSchema = new Schema<TBlog>({
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
  // headline: {
  //   type: String,
  //   required: true,
  // },
  // headlineDetails: {
  //   type: String,
  //   required: true,
  // },
  // bodyTextDetails: {
  //   type: String,
  //   required: true,
  // },
  // bodyImage: {
  //   type: String,
  //   required: [true, 'Images are required'],
  //   validate: {
  //     validator: function (value: string[]) {
  //       return value && value.length > 0;
  //     },
  //     message: 'At least one File is required',
  //   },
  // },
  // benefit: {
  //   type: String,
  //   required: true,
  // },
  // disadvantage: {
  //   type: String,
  //   required: true,
  // },
  // upload3Photos: {
  //   type: [videos],
  //   required: true,
  //   validate: {
  //     validator: function (value: string[]) {
  //       return value && value.length === 3;
  //     },
  //     message: 'Exactly 3 photos are required',
  //   },
  // },
  // ugcheadline: {
  //   type: String,
  //   required: true,
  // },
  // ugcDetails: {
  //   type: String,
  //   required: true,
  // },
  // ugcImage: {
  //   type: String,
  //   required: [true, 'Images are required'],
  //   validate: {
  //     validator: function (value: string[]) {
  //       return value && value.length > 0;
  //     },
  //     message: 'At least one File is required',
  //   },
  // },
  // keyOfFeature: {
  //   type: String,
  //   required: true,
  // },
  // price: {
  //   type: String,
  //   required: true,
  // },
},{timestamps:true});

const Blog = model<TBlog>('Blog', blogSchema);
export default Blog;
