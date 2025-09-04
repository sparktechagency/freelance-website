import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import FreelancerInfo from './freelancerInfo.model';

const updateSingleFreelancerinfoQuery = async (
  userId: string,
  payload: any,
) => {
  console.log('userId', userId);
  console.log('updated payload', payload);

  const freelancer: any = await User.findById(userId);
  if (!freelancer) {
    throw new AppError(404, 'Freelancer user is not found!');
  }

  const freelancerInfo = await FreelancerInfo.findById(freelancer.freelancerId);
  if (!freelancerInfo) {
    throw new AppError(404, 'FreelancerInfo is not found!');
  }

  const updateField = async (field: string, type: string) => {
    const fieldArray = freelancerInfo[field];

    const isExist = fieldArray.find(
      (item: any) => item[type] === payload[type],
    );
    if (isExist) {
      return isExist; 
    } else {
      fieldArray.push(payload); 
      const updateResult = await FreelancerInfo.findByIdAndUpdate(
        freelancer.freelancerId,
        {
          [field]: fieldArray, 
        },
        { new: true },
      );

      if (!updateResult) {
        throw new AppError(403, 'Freelancer info update failed!');
      }

      return updateResult;
    }
  };

  if (payload.type === 'education') {
    console.log('Updating education');
    return updateField('educationCertifications', 'degree');
  }

  if (payload.type === 'skill') {
    console.log('Updating skills');
    return updateField('skills', 'skill');
  }

  if (payload.type === 'experience') {
    console.log('Updating experience');
    return updateField('experience', 'companyName');
  }

  throw new AppError(400, 'Invalid payload type!');
};


const deletedFreelancerinfoQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const frelancerinfo = await FreelancerInfo.findById(id);
  if (!frelancerinfo) {
    throw new AppError(404, 'Frelancerinfo Not Found!!');
  }

  const result = await FreelancerInfo.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Frelancerinfo Result Not Found !');
  }

  return result;
};

export const freelancerinfoService = {
  updateSingleFreelancerinfoQuery,
  deletedFreelancerinfoQuery
};
