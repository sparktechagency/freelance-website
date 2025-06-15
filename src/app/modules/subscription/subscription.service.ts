import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TSubscription } from './subscription.interface';
import Subscription from './subscription.model';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import { unlink } from 'fs/promises';

const createSubscription = async ( files: any, payload: TSubscription) => {
  console.log('Subscription payload=', payload);

try {
  
  const existingSubscription = await Subscription.findOne({
    type: payload.type,
    isDeleted: false
  });
  if (existingSubscription) {
    throw new AppError(403, 'Subscription already exists!!');
  }

  if (files.image && files.image.length > 0) {
    const image: any = await uploadToS3({
      file: files.image[0],
      fileName: files.image[0].originalname,
      folder: 'subscription/',
    });
    payload.image = image;
  }

  const result = await Subscription.create(payload);

  if (result) {
    const fileDeletePath = `${files.image[0].path}`;
    await unlink(fileDeletePath);
  }

  return result;
  
} catch (error) {
  try {
    const fileDeletePath = `${files.image[0].path}`;
    await unlink(fileDeletePath);
  } catch (fsError) {
    console.error('Error accessing or deleting the image file:', fsError);
  }
  throw error;
  
}
};

const getAllsubscriptionQuery = async (query: Record<string, unknown>) => {
  const subscriptionQuery = new QueryBuilder(Subscription.find({isDeleted: false}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await subscriptionQuery.modelQuery;

  const meta = await subscriptionQuery.countTotal();
  return { meta, result };
};

const getSingleSubscriptionQuery = async (id: string) => {
  const existingSubscription: any = await Subscription.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingSubscription) {
    throw new AppError(404, 'Subscription not found!');
  }
  return existingSubscription;
};

const updateSingleSubscriptionQuery = async (id: string, files: any, payload: any) => {
  try {
    console.log('id', id);
    console.log('updated payload--', payload);

    // Find existing package by ID
    const existingPackage: any = await Subscription.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!existingPackage) {
      throw new AppError(404, 'Package not found!');
    }

    if (files?.image && files?.image.length > 0) {
      const image: any = await uploadToS3({
        file: files.image[0],
        fileName: files.image[0].originalname,
        folder: 'subscription/',
      });
      payload.image = image;

      const result = await Subscription.findByIdAndUpdate(id, payload, {
        new: true,
      });
      if (result) {
        const fileDeletePath = `${files.image[0].path}`;
        await unlink(fileDeletePath);
      }

      const key = existingPackage.image.split('amazonaws.com/')[1];

      const deleteImage: any = await deleteFromS3(key);
      console.log('deleteImage', deleteImage);
      if (!deleteImage) {
        throw new AppError(404, 'Blog Image Deleted File !');
      }

      return result;
    } else {
      const result = await Subscription.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return result;
    }
  } catch (error) {
    try {
      const fileDeletePath = `${files.image[0].path}`;
      await unlink(fileDeletePath);
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};

const deletedsubscriptionQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const existingSubscription: any = await Subscription.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingSubscription) {
    throw new AppError(404, 'Subscription not found!');
  }
 
  const result = await Subscription.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'Package Result Not Found !');
  }

  return result;
};

export const subscriptionService = {
  createSubscription,
  getAllsubscriptionQuery,
  getSingleSubscriptionQuery,
  updateSingleSubscriptionQuery,
  deletedsubscriptionQuery,
};
