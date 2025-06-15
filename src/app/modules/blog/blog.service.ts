import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPackage } from '../package/package.interface';
import { access, unlink } from 'fs/promises';
import Blog from './blog.model';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';

const createBlog = async (files: any, payload: TPackage) => {
  try {


    if (files.image && files.image.length > 0) {
      const image: any = await uploadToS3({
        file: files.image[0],
        fileName: files.image[0].originalname,
        folder: 'blogs/',
      });
      payload.image = image;
    }


    const result = await Blog.create(payload);
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

const getAllBlogQuery = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;

  const meta = await blogQuery.countTotal();
  return { meta, result };
};

const getSingleBlogQuery = async (id: string) => {
  const blog: any = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, 'Blog Not Found!!');
  }
  return blog;
};

const updateSingleBlogQuery = async (id: string, files: any, payload: any) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing package by ID
    const existingPackage: any = await Blog.findById(id);
    if (!existingPackage) {
      throw new AppError(404, 'Package not found!');
    }

    if (files?.image && files?.image.length > 0) {
      const image: any = await uploadToS3({
        file: files.image[0],
        fileName: files.image[0].originalname,
        folder: 'blogs/',
      });
      payload.image = image;

      const result = await Blog.findByIdAndUpdate(id, payload, {
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


    }else{

      const result = await Blog.findByIdAndUpdate(id, payload, {
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

const deletedBlogQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, 'Blog Not Found!!');
  }

  console.log('blogs', blog)

  const key = blog.image.split('amazonaws.com/')[1];;
  console.log('key', key)

  const deleteImage:any = await deleteFromS3(key);
  console.log('deleteImage', deleteImage)
  if(deleteImage) {
    const result =await Blog.findByIdAndDelete(id);
    return result;
  }else{
    throw new AppError(404, 'Blog Result Not Found !');
  }


};

export const blogService = {
  createBlog,
  getAllBlogQuery,
  getSingleBlogQuery,
  updateSingleBlogQuery,
  deletedBlogQuery,
};
