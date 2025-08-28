export type TPackage = {
  name: string;
  price: number;
  image: string;
  benefits: string[];
  duration: '1 month' | '3 months' | '6 months' | '1 year';
  meetCount: number;
  meetDuration: number;
  productId: string;
  priceId: string;
  paymentLink: string;
  isDeleted: boolean;
};
