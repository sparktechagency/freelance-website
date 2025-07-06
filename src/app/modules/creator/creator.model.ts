import mongoose from 'mongoose';
const { Schema } = mongoose;

const ugcExampleVideo = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const creatorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    houseBuildingNo: { type: String, required: true },
    niche: { type: String, required: true },
    language: { type: String, required: true },
    profession: { type: String, required: true },
    gender: { type: String, required: true },
    ethnicity: { type: String, required: true },
    bodyType: { type: String, required: true },
    hairType: { type: String, required: true },
    skinType: { type: String, required: true },
    tiktokHandle: { type: String, required: true },
    tiktokLink: { type: String, required: true },
    instragramHandle: { type: String, required: true },
    instragramLink: { type: String, required: true },
    othersSocialLink: { type: String, required: true },
    portfolioLink: { type: String, required: true },
    ugcExampleVideo: {
      type: [ugcExampleVideo],
      required: [true, 'ugc example video are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one File is required',
      },
    },
    introductionvideo: {
      type: String,
      required: [true, 'introduction video are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one File is required',
      },
    },
    bankType: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    swiftCode: { type: String, required: true },
    bankName: { type: String, required: true },
    iban: { type: String, required: true },
    paypalEmail: { type: String, required: true },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'approved', 'cancel'] },
  },
  { timestamps: true },
);

// Create the model
const Creator = mongoose.model('Creator', creatorSchema);

export default Creator ;
