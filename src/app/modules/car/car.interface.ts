import { Types } from 'mongoose';

export type TCar = {
  title: string;
  description: string;
  price: number;
  images: string[];
  facility: string[];
  location: string;
  ratings: number;
  reviews: number;
  isDeleted: boolean;
};
