import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import FreelancerInfo from './freelancerInfo.model';


const updateSingleFreelancerinfoQuery = async (
  userId: string,
  payload: any,
  operation: 'add' | 'update' | 'delete',
) => {
  // console.log('userId', userId); 

  const freelancer: any = await User.findById(userId);
  if (!freelancer) {
    throw new AppError(404, 'Freelancer user is not found!');
  }

  const freelancerInfo = await FreelancerInfo.findById(freelancer.freelancerId);
  if (!freelancerInfo) {
    throw new AppError(404, 'FreelancerInfo is not found!');
  }

// Helper function to find item index by _id
  const findItemIndexById = (fieldArray: any[], id: string) => {
    return fieldArray.findIndex((item: any) => item._id.toString() === id);
  };

  // ADD operation (uses field values as identifier)
  const addField = async (field: string, identifier: string) => {
    const fieldArray = [...freelancerInfo[field]];

    // Check if item already exists (for add operation only)
    const isExist = fieldArray.find(
      (item: any) => item[identifier] === payload[identifier],
    );
    if (isExist) {
      throw new AppError(400, `${field} item already exists!`);
    }

    fieldArray.push(payload);

    const updateResult = await FreelancerInfo.findByIdAndUpdate(
      freelancer.freelancerId,
      { [field]: fieldArray },
      { new: true },
    );

    if (!updateResult) {
      throw new AppError(403, `Freelancer ${field} add failed!`);
    }

    return updateResult;
  };

  // UPDATE operation (uses _id as identifier)
  const updateField = async (field: string) => {
    console.log('field', field);

    if (!payload._id) {
      throw new AppError(400, `_id is required for ${field} update operation!`);
    }

    const fieldArray = [...freelancerInfo[field]];
    console.log('fieldArray before update:', fieldArray);

    const itemIndex = findItemIndexById(fieldArray, payload._id);
    console.log('itemIndex found:', itemIndex);

    if (itemIndex === -1) {
      throw new AppError(
        404,
        `${field} item with _id ${payload._id} not found for update!`,
      );
    }

    console.log('item before update:', fieldArray[itemIndex]);
    console.log('update payload:', payload);

    // Update the item while preserving its _id
    const updatedItem = {
      ...(fieldArray[itemIndex].toObject
        ? fieldArray[itemIndex].toObject()
        : fieldArray[itemIndex]),
      ...payload,
    };

    // Ensure _id is not overwritten
    updatedItem._id = fieldArray[itemIndex]._id;

    fieldArray[itemIndex] = updatedItem;

    console.log('item after update:', fieldArray[itemIndex]);

    const updateResult = await FreelancerInfo.findByIdAndUpdate(
      freelancer.freelancerId,
      { [field]: fieldArray },
      { new: true },
    );

    if (!updateResult) {
      throw new AppError(403, `Freelancer ${field} update failed!`);
    }

    console.log('Update successful');
    return updateResult;
  };

  // DELETE operation (uses _id as identifier)
  const deleteField = async (field: string) => {
    if (!payload._id) {
      throw new AppError(400, `_id is required for ${field} delete operation!`);
    }

    const fieldArray = [...freelancerInfo[field]];

    const itemIndex = findItemIndexById(fieldArray, payload._id);

    if (itemIndex === -1) {
      throw new AppError(
        404,
        `${field} item with _id ${payload._id} not found for deletion!`,
      );
    }

    // Remove the item
    fieldArray.splice(itemIndex, 1);

    const updateResult = await FreelancerInfo.findByIdAndUpdate(
      freelancer.freelancerId,
      { [field]: fieldArray },
      { new: true },
    );

    if (!updateResult) {
      throw new AppError(403, `Freelancer ${field} delete failed!`);
    }

    return updateResult;
  };

  // Comments specific operations
  const updateComments = async (comments: string) => {
    const updateResult = await FreelancerInfo.findByIdAndUpdate(
      freelancer.freelancerId,
      { comments: comments },
      { new: true },
    );

    if (!updateResult) {
      throw new AppError(403, 'Freelancer comments update failed!');
    }

    return updateResult;
  };

  // const deleteComments = async () => {
  //   const updateResult = await FreelancerInfo.findByIdAndUpdate(
  //     freelancer.freelancerId,
  //     { comments: '' },
  //     { new: true },
  //   );

  //   if (!updateResult) {
  //     throw new AppError(403, 'Freelancer comments delete failed!');
  //   }

  //   return updateResult;
  // };

  // Route based on type and operation
  if (payload.type === 'education') {
    console.log('Processing education');
    if (operation === 'add')
      return addField('educationCertifications', 'degree');
    if (operation === 'update') return updateField('educationCertifications');
    if (operation === 'delete') return deleteField('educationCertifications');
  }

  if (payload.type === 'skill') {
    console.log('Processing skills');
    if (operation === 'add') return addField('skills', 'skill');
    if (operation === 'update') return updateField('skills');
    if (operation === 'delete') return deleteField('skills');
  }

  if (payload.type === 'experience') {
    console.log('Processing experience');
    if (operation === 'add') return addField('experience', 'companyName');
    if (operation === 'update') return updateField('experience');
    if (operation === 'delete') return deleteField('experience');
  }

  if (payload.type === 'socialLink') {
    console.log('Processing socialLink');
    if (operation === 'add') return addField('socialLinks', 'name');
    if (operation === 'update') return updateField('socialLinks');
    if (operation === 'delete') return deleteField('socialLinks');
  }

  if (payload.type === 'comments') {
    console.log('Processing comments');
    if (operation === 'add' || operation === 'update')
      return updateComments(payload.comments);
    // if (operation === 'delete') return deleteComments();
  }

  throw new AppError(400, 'Invalid payload type or operation!');
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
