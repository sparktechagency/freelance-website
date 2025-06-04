import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPackage } from '../package/package.interface';
import { access, unlink } from 'fs/promises';
import Blog from './blog.model';

const createBlog = async (payload: TPackage) => {
  try {
    const result = await Blog.create(payload);
    return result;
  } catch (error) {
    try {
      const imagePath = `public/${payload.image}`;
      await access(imagePath);
      await unlink(imagePath);
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

const updateSingleBlogQuery = async (id: string, payload: any) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing package by ID
    const existingPackage: any = await Blog.findById(id);
    if (!existingPackage) {
      throw new AppError(404, 'Package not found!');
    }

    // Update package
    const updatedPackage = await Blog.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedPackage) {
      throw new AppError(403, 'Package update failed!');
    }

    console.log('result', updatedPackage);

    // Only delete old image if a new image is provided in the payload and it's different
    if (payload.image && payload.image !== existingPackage.image) {
      const oldImagePath = `public/${existingPackage.image}`;
      console.log('Deleting old image at:', oldImagePath);

      try {
        await access(oldImagePath);
        await unlink(oldImagePath);
      } catch (fsError) {
        console.error('Error accessing or deleting old image file:', fsError);
      }
    }

    return updatedPackage;
  } catch (error) {
    if (payload.image) {
      const newImagePath = `public/${payload.image}`;
      try {
        await access(newImagePath);
        await unlink(newImagePath);
      } catch (fsError) {
        console.error('Error accessing or deleting new image file:', fsError);
      }
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

  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Blog Result Not Found !');
  }

  return result;
};

export const blogService = {
  createBlog,
  getAllBlogQuery,
  getSingleBlogQuery,
  updateSingleBlogQuery,
  deletedBlogQuery,
};
