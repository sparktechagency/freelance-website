import { Model, Types } from 'mongoose';

import { USER_ROLE } from './user.constants';

interface IAddress {
  house: string;
  area: string;
  city: string;
  state: string;
  country: string;
}

export interface TUserCreate {
  fullName: string;
  email: string;
  password: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  designation: string;
  yearsOfExperience: string;
  location: string;
  language: [string];
  isAvailable: boolean;
  isVarified: boolean;
  dailyRate: number;
  aboutCompany: string;
  companyName: string;
  companyId:string
}

export interface TUser extends TUserCreate {
  _id: string;
  isSubscribed: boolean;
  subscriptionId: Types.ObjectId;
  profile: string;
  isActive: boolean;
  isDeleted: boolean;
  // clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  isUserActive(email: string): Promise<TUser>;
  IsUserExistById(id: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type IPaginationOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
