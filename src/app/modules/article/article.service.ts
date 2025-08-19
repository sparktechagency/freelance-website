import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import AcreateArticle from './article.model';
import { Category } from '../category/category.model';
import { TArticle } from './article.interface';
import Article from './article.model';
import FavoriteProduct from '../favorite/favorite.model';

const createArticle = async (files: any, payload: TArticle) => {
  try {
    

    // if (files.image && files.image.length > 0) {
    //   const image: any = await uploadToS3({
    //     file: files.image[0],
    //     fileName: files.image[0].originalname,
    //     folder: 'AcreateArticles/',
    //   });
    //   payload.image = image;
    // }

    if (files.image && files.image.length > 0) {
      const image: any = files.image[0].path.replace(/^public[\\/]/, '');
      payload.image = image;
    }

    const result = await Article.create(payload);

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

const getAllArticleQuery = async (query: Record<string, unknown>, userId: string) => {
  const AcreateArticleQuery = new QueryBuilder(
    Article.find({ isDeleted: false }).lean(),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AcreateArticleQuery.modelQuery;

   const favoriteCourses = await FavoriteProduct.find({
     userId,
     type: 'article',
   }).lean();

   console.log('result (raw)=', result);
   console.log('favoriteCourses=', favoriteCourses);

   // Add isFavorite field to each course
   result.forEach((article: any) => {
     article.isFavorite = favoriteCourses.some(
       (favorite) => favorite.articleId?.toString() === article._id?.toString(),
     );
   });

  const meta = await AcreateArticleQuery.countTotal();
  return { meta, result };
};

const getSingleArticleQuery = async (id: string, userId: string) => {
  const existingArticle: any = await Article.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingArticle) {
    throw new AppError(404, 'AcreateArticle not found!');
  }

  console.log('existingArticle=', existingArticle);

     const favoriteArticles = await FavoriteProduct.find({
       userId,
       type: 'article',
     });

     const isFavoriteArticle = favoriteArticles.find((favorite) =>
       favorite.articleId.equals(existingArticle._id),
     );

     console.log('favoriteArticles=', favoriteArticles);

     console.log('isFavoriteArticle==', isFavoriteArticle);

     const updateData = {
       ...existingArticle._doc,
       isFavorite: isFavoriteArticle ? true : false,
     };

  return updateData;
};

const updateSingleArticleQuery = async (
  id: string,
  files: any,
  payload: any,
) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing AcreateArticle by ID
    const existingAcreateArticle: any = await Article.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!existingAcreateArticle) {
      throw new AppError(404, 'AcreateArticle not found!');
    }

    if (files?.image && files?.image.length > 0) {
      // const image: any = await uploadToS3({
      //   file: files.image[0],
      //   fileName: files.image[0].originalname,
      //   folder: 'AcreateArticles/',
      // });
      //  payload.image = image;

      const image: any = files.image[0].path.replace(/^public[\\/]/, '');
      payload.image = image;

      const result = await Article.findByIdAndUpdate(id, payload, {
        new: true,
      });
      // if (result) {
      //   const fileDeletePath = `${files.image[0].path}`;
      //   await unlink(fileDeletePath);
      // }

      // const key = existingAcreateArticle.image.split('amazonaws.com/')[1];

      // const deleteImage: any = await deleteFromS3(key);
      // console.log('deleteImage', deleteImage);
      // if (!deleteImage) {
      //   throw new AppError(404, 'Blog Image Deleted File !');
      // }

      return result;
    } else {
      const result = await Article.findByIdAndUpdate(id, payload, {
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


const deletedArticleQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const existingArticle: any = await Article.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!existingArticle) {
    throw new AppError(404, 'Article not found!');
  }

  const result = await Article.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'AcreateArticle Result Not Found !');
  }

  return result;
};

export const articleService = {
  createArticle,
  getAllArticleQuery,
  getSingleArticleQuery,
  updateSingleArticleQuery,
  deletedArticleQuery,
};
