import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPackage } from './package.interface';
import Package from './package.model';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import { createSubscriptionProduct } from '../../helpers/stripe/stripe/createSubscriptionProductHelper';


  const createPackage = async (files: any, payload: TPackage) => {
    try {
       
        const existingPackage: any = await Package.findOne({
          name: payload.name,
          isDeleted: false,
        });
        console.log('existingPackage', existingPackage);
        if (existingPackage) {
          throw new AppError(403, 'Package already exists!!');
        }



        // if (files.image && files.image.length > 0) {
        //   const image: any = await uploadToS3({
        //     file: files.image[0],
        //     fileName: files.image[0].originalname,
        //     folder: 'packages/',
        //   });
        //   payload.image = image;
        // }

        if (files.image && files.image.length > 0) {
          const image: any = files.image[0].path.replace(/^public[\\/]/, '');
          payload.image = image;
        }

        const stripeProductData = {
          name: payload.name,
          price: payload.price,
          duration: payload.duration,

        }

      const stripeProduct = await  createSubscriptionProduct(stripeProductData);

      if (!stripeProduct) {
        throw new AppError(404, 'Stripe product not found!');
      }

      payload.priceId = stripeProduct.priceId;
      payload.productId = stripeProduct.productId;
      payload.paymentLink = stripeProduct.paymentLink;


      const result = await Package.create(payload);

      // if (result) {
      //   const fileDeletePath = `${files.image[0].path}`;
      //   await unlink(fileDeletePath);
      // }
      return result;
    } catch (error) {
      // try {
      //   const fileDeletePath = `${files.image[0].path}`;
      //   await unlink(fileDeletePath);
      // } catch (fsError) {
      //   console.error('Error accessing or deleting the image file:', fsError);
      // }
      throw error;
    }
  };

const getAllPackageQuery = async (query: Record<string, unknown>) => {
  const packageQuery = new QueryBuilder(Package.find({isDeleted: false, type: 'monthly'}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await packageQuery.modelQuery;

  const meta = await packageQuery.countTotal();
  return { meta, result };
};

const getAllSubscriptionPackageQuery = async (query: Record<string, unknown>) => {
  const packageQuery = new QueryBuilder(Package.find({isDeleted: false, type: ['monthly', 'yearly']}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await packageQuery.modelQuery;

  const meta = await packageQuery.countTotal();
  return { meta, result };
};

const getSinglePackageQuery = async (id: string) => {
  const existingPackage: any = await Package.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingPackage) {
    throw new AppError(404, 'Package not found!');
  }
  
  return existingPackage;
};

const updateSinglePackageQuery = async (id: string, files:any, payload: any) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing package by ID
    const existingPackage: any = await Package.findOne({_id: id, isDeleted: false});
    if (!existingPackage) {
      throw new AppError(404, 'Package not found!');
    }

    if (files?.image && files?.image.length > 0) {
      // const image: any = await uploadToS3({
      //   file: files.image[0],
      //   fileName: files.image[0].originalname,
      //   folder: 'packages/',
      // });
//  payload.image = image;
  
         const image: any = files.image[0].path.replace(/^public[\\/]/, '');
         payload.image = image;
       

      const result = await Package.findByIdAndUpdate(id, payload, {
        new: true,
      });
      // if (result) {
      //   const fileDeletePath = `${files.image[0].path}`;
      //   await unlink(fileDeletePath);
      // }

      // const key = existingPackage.image.split('amazonaws.com/')[1];

      // const deleteImage: any = await deleteFromS3(key);
      // console.log('deleteImage', deleteImage);
      // if (!deleteImage) {
      //   throw new AppError(404, 'Blog Image Deleted File !');
      // }

      return result;
    } else {
      const result = await Package.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return result;
    }
  } catch (error) {
    // try {
    //   const fileDeletePath = `${files.image[0].path}`;
    //   await unlink(fileDeletePath);
    // } catch (fsError) {
    //   console.error('Error accessing or deleting the image file:', fsError);
    // }
    throw error;
  }
};

const deletedPackageQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const existingPackage: any = await Package.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingPackage) {
    throw new AppError(404, 'Package not found!');
  }
 

  const result = await Package.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
  if (!result) {
    throw new AppError(404, 'Package Result Not Found !');
  }

  return result;
};

export const packageService = {
  createPackage,
  getAllPackageQuery,
  getAllSubscriptionPackageQuery,
  getSinglePackageQuery,
  updateSinglePackageQuery,
  deletedPackageQuery,
};
