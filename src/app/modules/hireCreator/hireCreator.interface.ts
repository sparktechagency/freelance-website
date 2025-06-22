import { Types } from "mongoose";


export type TBrandInfo = {
  name: string;
  email: string;
  phone: string;
  productName: string;
  productLink: string;
  productType: string;
};
export type TBrandSocial = {
  tiktokHandle: string;
  tiktokLink: string;
  instragramHandle: string;
  instragramLink: string;
  websiteLink: string;
};
export type TContentInfo = {
  additionalFormate: string;
  videoDuration: string;
  platForm: string;
  usageType: string;
  adHookOrCtaRequest?: string;
  exampleVideoLink: string;
  ugcPhoto: string;
};

export type TCharacteristicInfo = {
  ageRange: string;
  gender: string;
  location: string;
  language: string;
  script: string;
};

export type TDoAndDonts = {
  anyWordsNotToUse: string;
  anySpecificWordsUse: string;
  howToPronouncebrandName: string;
  anySpecialRequest: string;
  expressDelivery: string;
};

export type TLastContentInfo = {
  textOverlay?: string;
  captions?: string;
  music: string;
  extraHook: string;
  extraCta: string;
  videoType: string;
  additionalPerson: string;
  offSiteAttraction: string;
  goalOfProject: string;
  tergetAudience: string;
};



export type TBrand = {
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  brandInfo: TBrandInfo;
  brandSocial: TBrandSocial;
  contentInfo: TContentInfo;
  characteristicInfo: TCharacteristicInfo;
  doAndDonts: TDoAndDonts;
  lastContentInfo: TLastContentInfo;
  status: string;
  paymentStatus: string;
  takeVideoCount: number;

 
};
