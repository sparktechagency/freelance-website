export type TPackage = {
  category:"freelancer" | "client"
  title: string;
  price: number;
  image: string;
  benefits: string[];
  type: 'monthly' | 'yearly';
  tenderCount: number | string;
  isDeleted: boolean;
  isBadge: boolean;
  isSupport: boolean;
};
