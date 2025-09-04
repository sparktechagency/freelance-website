const mongoose = require('mongoose');
const { Schema } = mongoose;

// Education Schema
const EducationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

// Skill Schema
const SkillSchema = new Schema({
  category: { type: String, required: true },
  skill: { type: String, required: true },
});

// Experience Schema
const ExperienceSchema = new Schema({
  companyName: { type: String, required: true },
  project: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
});

// Freelancer Info Schema
const FreelancerInfoSchema = new Schema({
  freelancerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  educationCertifications: { type: [EducationSchema], required: false },
  skills: { type: [SkillSchema], required: false },
  experience: { type: [ExperienceSchema], required: false },
},{ timestamps: true });

const FreelancerInfo = mongoose.model('FreelancerInfo', FreelancerInfoSchema);

export default FreelancerInfo;
