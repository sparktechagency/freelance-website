import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import { TCourse } from './course.interface';
import Course from './course.model';
import { Category } from '../category/category.model';
import FavoriteProduct from '../favorite/favorite.model';

const createCourse = async (files: any, payload: TCourse) => {
  try {

    const category = await Category.findById(payload.categoryId);

    if (!category) {
      throw new AppError(404, 'Category not found!');
    }

    payload.categoryName = category.name;
   

    // if (files.image && files.image.length > 0) {
    //   const image: any = await uploadToS3({
    //     file: files.image[0],
    //     fileName: files.image[0].originalname,
    //     folder: 'Courses/',
    //   });
    //   payload.image = image;
    // }



    if (files.video && files.video.length > 0) {
      const image: any = files.video[0].path.replace(/^public[\\/]/, '');
      payload.video = image;
    }

    const result = await Course.create(payload);

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

const getAllCourseQuery = async (query: Record<string, unknown>, userId: string) => {
  const CourseQuery = new QueryBuilder(
    Course.find({ isDeleted: false, }).lean(),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CourseQuery.modelQuery;

   const favoriteCourses = await FavoriteProduct.find({
     userId,
     type: 'course',
   }).lean();

   console.log('result (raw)=', result);
   console.log('favoriteCourses=', favoriteCourses);

   // Add isFavorite field to each course
   result.forEach((course: any) => {
     course.isFavorite = favoriteCourses.some(
       (favorite) => favorite.courseId?.toString() === course._id?.toString(),
     );
   });

  console.log('result=end', result);

  const meta = await CourseQuery.countTotal();
  return { meta, result };
};



const getSingleCourseQuery = async (id: string, userId: string) => {
  const existingCourse: any = await Course.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingCourse) {
    throw new AppError(404, 'Course not found!');
  }

   const favoriteCourses = await FavoriteProduct.find({ userId, type: 'course' });

   const isFavoriteCourse = favoriteCourses.find((favorite) =>
     favorite.courseId.equals(existingCourse._id),
   );

   console.log('favoriteCourses=', favoriteCourses);

   console.log('isFavoriteCourse==', isFavoriteCourse);

   const updateData = {
     ...existingCourse._doc,
     isFavorite: isFavoriteCourse ? true : false,
   };

  return updateData;
};

const updateSingleCourseQuery = async (
  id: string,
  files: any,
  payload: any,
) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing Course by ID
    const existingCourse: any = await Course.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!existingCourse) {
      throw new AppError(404, 'Course not found!');
    }

    if (files?.video && files?.video.length > 0) {
      // const image: any = await uploadToS3({
      //   file: files.image[0],
      //   fileName: files.image[0].originalname,
      //   folder: 'Courses/',
      // });
      //  payload.image = image;

      const image: any = files.video[0].path.replace(/^public[\\/]/, '');
      payload.video = image;

      const result = await Course.findByIdAndUpdate(id, payload, {
        new: true,
      });
      // if (result) {
      //   const fileDeletePath = `${files.image[0].path}`;
      //   await unlink(fileDeletePath);
      // }

      // const key = existingCourse.image.split('amazonaws.com/')[1];

      // const deleteImage: any = await deleteFromS3(key);
      // console.log('deleteImage', deleteImage);
      // if (!deleteImage) {
      //   throw new AppError(404, 'Blog Image Deleted File !');
      // }

      return result;
    } else {
      const result = await Course.findByIdAndUpdate(id, payload, {
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
const viewCountSingleCourse = async (id: string) => {
  const existingCourse: any = await Course.findOne({
    _id: id,
    isDeleted: false,
  })
  if (!existingCourse) {
    throw new AppError(404, 'Course not found!');
  }
  const result = await Course.findOneAndUpdate(
    { _id: id },
    { $inc: { viewCount: 1 } },
    { new: true },
  );
  return result;
};

const deletedCourseQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const existingCourse: any = await Course.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingCourse) {
    throw new AppError(404, 'Course not found!');
  }

  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'Course Result Not Found !');
  }

  return result;
};

export const courseService = {
  createCourse,
  getAllCourseQuery,
  getSingleCourseQuery,
  updateSingleCourseQuery,
  viewCountSingleCourse,
  deletedCourseQuery,
};
