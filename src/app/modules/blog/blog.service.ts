import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPackage } from '../package/package.interface';
import { access, unlink } from 'fs/promises';
import Blog from './blog.model';
import { deleteFromS3, deleteManyFromS3, uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { TBlog } from './blog.interface';

const createBlog = async (files: any, payload: TBlog) => {
  try {


    if (files.image && files.image.length > 0) {
      const image: any = await uploadToS3({
        file: files.image[0],
        fileName: files.image[0].originalname,
        folder: 'blogs/',
      });
      payload.image = image;
    }
    if (files.bodyImage && files.bodyImage.length > 0) {
      const image: any = await uploadToS3({
        file: files.bodyImage[0],
        fileName: files.bodyImage[0].originalname,
        folder: 'blogs/',
      });
      payload.bodyImage = image;
    }
    if (files.upload3Photos && files.upload3Photos.length > 0) {
      const upload3Photos = await uploadManyToS3(files.upload3Photos, 'blogs/');
      payload.upload3Photos = upload3Photos;
    }
    if (files.ugcImage && files.ugcImage.length > 0) {
      const image: any = await uploadToS3({
        file: files.ugcImage[0],
        fileName: files.ugcImage[0].originalname,
        folder: 'blogs/',
      });
      payload.ugcImage = image;
    }


    const result = await Blog.create(payload);
    if (result) {
      const fileDeletePathimage = `${files.image[0].path}`;
      await unlink(fileDeletePathimage);

      const fileDeletePathbodyImage = `${files.bodyImage[0].path}`;
      await unlink(fileDeletePathbodyImage);

      const fileDeletePathupload3Photos =files.upload3Photos.map((file: any) => `${file.path}`);
      for (const fileDeletePath of fileDeletePathupload3Photos) {
        await unlink(fileDeletePath);
      }

      const fileDeletePathugcImage = `${files.ugcImage[0].path}`;
      await unlink(fileDeletePathugcImage);
      
    }
    return result;
  } catch (error) {
    try {
      const fileDeletePathimage = `${files.image[0].path}`;
      await unlink(fileDeletePathimage);

      const fileDeletePathbodyImage = `${files.bodyImage[0].path}`;
      await unlink(fileDeletePathbodyImage);

      const fileDeletePathupload3Photos = files.upload3Photos.map(
        (file: any) => `${file.path}`,
      );
      for (const fileDeletePath of fileDeletePathupload3Photos) {
        await unlink(fileDeletePath);
      }

      const fileDeletePathugcImage = `${files.ugcImage[0].path}`;
      await unlink(fileDeletePathugcImage);
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

  const key1 = blog.image.split('amazonaws.com/')[1];
  const deleteImage1:any = await deleteFromS3(key1);

  const key2 = blog.bodyImage.split('amazonaws.com/')[1];
  const deleteImage2:any = await deleteFromS3(key2);

  const key3 = blog.ugcImage.split('amazonaws.com/')[1];
  const deleteImage3:any = await deleteFromS3(key3);


  const keys = blog?.upload3Photos?.map(
    (key: any) => key.url.split('amazonaws.com/')[1],
  );
  const deleteImages: any = await deleteManyFromS3(keys);
  console.log('deleteImage', deleteImages);

  if (deleteImage1 && deleteImage2 && deleteImage3 && deleteImages) {
    const result = await Blog.findByIdAndDelete(id);
    return result;
  } else {
    throw new AppError(500, 'Failed to delete one or more images from S3');
  }


};

export const blogService = {
  createBlog,
  getAllBlogQuery,
  getSingleBlogQuery,
  updateSingleBlogQuery,
  deletedBlogQuery,
};
