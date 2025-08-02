import { Types } from "mongoose";

export type TBlogSection = {
  blogId: Types.ObjectId;
  subTitle: string;
  subDetails: string;
  image1: string;
  image2: string;
};

export type TBlog = {
  image: string;
  title: string;
  details: string;
  subBlogSections: TBlogSection[];
};
