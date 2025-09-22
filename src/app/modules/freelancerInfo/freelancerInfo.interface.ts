import { Types } from "mongoose";

export type TEducations = {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
};

export type TSkill = {
  category: string;
  skill: string;
};
export type TSocialLink = {
  name: string;
  link: string;
};

export type TExperience = {
  companyName: string;
  project: string;
  startDate: string;
  endDate: string;
  description: string;
};




export type TFreelancerInfo = {
  freelancerUserId: Types.ObjectId;
  educationCertifications: [TEducations];
  skills: [TSkill];
  experience: [TExperience];
  socialLinks: [TSocialLink];
  comments:string;
};