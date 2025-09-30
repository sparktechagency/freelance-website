import { Error, Schema, Types, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import { gender, Role, USER_ROLE } from './user.constants';

const userSchema = new Schema<TUser>(
  {
    profile: {
      type: String,
      default: `uploads/profile/default-user.jpg`,
    },
    coverPhoto: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Role,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    designation: {
      type: String,
      required: false,
      default: '',
    },
    yearsOfExperience: {
      type: String,
      required: false,
      default: '',
    },
    location: {
      type: String,
      required: false,
      default: '',
    },
    language: {
      type: [String],
      required: false,
      default: [],
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
    isSupported: {
      type: Boolean,
      default: false,
    },
    dailyRate: {
      type: Number,
      default: 0,
    },
    aboutCompany: {
      type: String,
      default: '',
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    // clientId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Client',
    //   default: null,
    // },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: 'FreelancerInfo',
      default: null,
    },
    companyId: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    jobsDone: {
      type: Number,
      required: false,
      default: 0,
    },
    serviceType: {
      type: String,
      required: false,
    },
    categoryType: {
      type: String,
      required: false,
    },
    isStripeConnectedAccount: {
      type: Boolean,
      required: false,
      default: false,
    },
    followers: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Remove password field
  return user;
};

// filter out deleted documents
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  // console.log({ email });
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.isUserActive = async function (email: string) {
  return await User.findOne({
    email: email,
    isDeleted: false,
    isActive: true,
  }).select('+password profile fullName email role');
};

userSchema.statics.IsUserExistById = async function (id: string) {
  return await User.findById(id).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
