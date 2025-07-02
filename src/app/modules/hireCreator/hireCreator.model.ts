
import mongoose, { Schema } from 'mongoose';

const brandInfoSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  productName: { type: String, required: true },
  productLink: { type: String, required: true },
  productType: { type: String, required: true },
});

const brandSocialSchema = new Schema({
  tiktokHandle: { type: String, required: true },
  tiktokLink: { type: String, required: true },
  instragramHandle: { type: String, required: true },
  instragramLink: { type: String, required: true },
  websiteLink: { type: String, required: true },
});

const contentInfoSchema = new Schema({
  additionalFormate: { type: String, required: true },
  videoDuration: { type: String, required: true },
  platForm: { type: String, required: true },
  usageType: { type: String, required: true },
  adHookOrCtaRequest: { type: String },
  exampleVideoLink: { type: String, required: true },
  ugcPhoto: {
    type: String,
    required: [true, 'UGC Photo are required'],
    validate: {
      validator: function (value: string[]) {
        return value && value.length > 0;
      },
      message: 'At least one File is required',
    },
  },
});

const characteristicInfoSchema = new Schema({
  ageRange: { type: String, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  language: { type: String, required: true },
  script: { type: String, required: true },
});

const doAndDontsSchema = new Schema({
  anyWordsNotToUse: { type: String, required: true },
  anySpecificWordsUse: { type: String, required: true },
  howToPronouncebrandName: { type: String, required: true },
  anySpecialRequest: { type: String, required: true },
  expressDelivery: { type: String, required: true },
});

const lastContentInfoSchema = new Schema({
  textOverlay: { type: String },
  captions: { type: String },
  music: { type: String, required: true },
  extraHook: { type: String, required: true },
  extraCta: { type: String, required: true },
  videoType: { type: String, required: true },
  additionalPerson: { type: String, required: true },
  offSiteAttraction: { type: String, required: true },
  goalOfProject: { type: String, required: true },
  tergetAudience: { type: String, required: true },
});

const uploads = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const hireCreatorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    brandInfo: { type: brandInfoSchema, required: true },
    brandSocial: { type: brandSocialSchema, required: true },
    contentInfo: { type: contentInfoSchema, required: true },
    characteristicInfo: { type: characteristicInfoSchema, required: true },
    doAndDonts: { type: doAndDontsSchema, required: true },
    lastContentInfo: { type: lastContentInfoSchema, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        'draft',
        'pending',
        'approved',
        'cancel',
        'ongoing',
        'delivered',
        'revision',
        'completed',
      ],
      default: 'draft',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'Failed'],
      default: 'pending',
    },
    takeVideoCount: { type: Number, required: true, default: 0 },
    creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: false },
    creatorUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    creatorPaymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    creatorPrice: { type: Number, required: false },
    uploadedFiles: {
      type: [uploads],
      default: [],
      required: false,
    },
    isScript: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

const HireCreator = mongoose.model('HireCreator', hireCreatorSchema);

export default HireCreator;

