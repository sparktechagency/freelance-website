import mongoose from 'mongoose';
import { TBrand } from './brand.interface';

const TBrandSchema = new mongoose.Schema<TBrand>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    productName: { type: String, required: true },
    productLink: { type: String, required: true },
    productType: { type: String, required: true },
    tiktokHandle: { type: String, required: true },
    tiktokLink: { type: String, required: true },
    instragramHandle: { type: String, required: true },
    instragramLink: { type: String, required: true },
    websiteLink: { type: String, required: true },
    additionalFormate: { type: String, required: true },
    videoDuration: { type: String, required: true },
    platForm: { type: String, required: true },
    usageType: { type: String, required: true },
    adHookOrCtaRequest: { type: String, default: null },
    exampleVideoLink: { type: String, required: true },
    ugcPhotos: {
      type: [String],
      required: [true, 'introduction video are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one File is required',
      },
    },
    ageRange: { type: String, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    language: { type: String, required: true },
    script: { type: String, required: true },
    anyWordsNotToUse: { type: String, required: true },
    anySpecificWordsUse: { type: String, required: true },
    howToPronouncebrandName: { type: String, required: true },
    anySpecialRequest: { type: String, required: true },
    expressDelivery: { type: String, required: true },
    textOverlay: { type: String, default: null },
    captions: { type: String, default: null },
    music: { type: String, required: true },
    extraHook: { type: String, required: true },
    extraCta: { type: String, required: true },
    videoType: { type: String, required: true },
    additionalPerson: { type: String, required: true },
    offSiteAttraction: { type: String, required: true },
    goalOfProject: { type: String, required: true },
    tergetAudience: { type: String, required: true },
  },
  { timestamps: true },
);

const Brand = mongoose.model('Brand', TBrandSchema);

export default Brand;
