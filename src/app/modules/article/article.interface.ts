import { Types } from "mongoose"

export type TArticle = {
  title: string;
  description: string;
  image: string;
  publicationDate: Date;
  sourseName: string;
  readTime: string
  isDeleted: boolean;
};