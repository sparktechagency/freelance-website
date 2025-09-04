export type TPackage = {
  title: string;
  price: number;
  image: string;
  benefits: string[];
  type: 'monthly' | 'yearly';
  tenderCount: number | string;
  isDeleted: boolean;
};
