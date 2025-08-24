import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';
import { TfavoriteProduct } from './favorite.interface';
import AppError from '../../error/AppError';
import FavoriteProduct from './favorite.model';
import Course from '../course/course.model';
import Article from '../article/article.model';

const createOrDeleteFavoriteProduct = async (
  payload: TfavoriteProduct,
  userId: string,
) => {
  const { courseId, articleId } = payload;


  if (courseId) {
    const course = await Course.findById(courseId);

    if (!course) {
      throw new AppError(404, 'Course not found!');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found!');
    }
    const existingFavoriteProduct = await FavoriteProduct.findOne({
      courseId,
      userId,
    }).populate('courseId');

    if (existingFavoriteProduct) {
      await FavoriteProduct.findByIdAndDelete(existingFavoriteProduct._id);
      const favoriteProduct = {
        ...existingFavoriteProduct.toObject(),
        favoriteProduct: false,
      };
      return {
        message: 'Favorite Product deleted !!',
        data: favoriteProduct,
      };
    } else {
      const newFavoriteProduct = new FavoriteProduct({
        ...payload,
        userId,
      });
      await newFavoriteProduct.save();
      const populatedResult = await newFavoriteProduct.populate('courseId');
      const favoriteProduct = {
        ...populatedResult.toObject(),
        favoriteProduct: true,
      };
      return {
        message: 'Favorite Product successful!',
        data: favoriteProduct,
      };
    }
  } else {
    const article = await Article.findById(articleId);

    if (!article) {
      throw new AppError(404, 'Article not found!');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found!');
    }
    const existingFavoriteProduct = await FavoriteProduct.findOne({
      articleId,
      userId,
    }).populate('articleId');

    if (existingFavoriteProduct) {
      await FavoriteProduct.findByIdAndDelete(existingFavoriteProduct._id);
      const favoriteProduct = {
        ...existingFavoriteProduct.toObject(),
        favoriteProduct: false,
      };
      return {
        message: 'Favorite Product deleted !!',
        data: favoriteProduct,
      };
    } else {
      const newFavoriteProduct = new FavoriteProduct({
        ...payload,
        userId,
      });
      await newFavoriteProduct.save();
      const populatedResult = await newFavoriteProduct.populate('articleId');
      const favoriteProduct = {
        ...populatedResult.toObject(),
        favoriteProduct: true,
      };
      return {
        message: 'Favorite Product successful',
        data: favoriteProduct,
      };
    }
  }

  
};

// const createFavoritecreateOrDeleteFavoriteProduct = async (payload:TFavoritecreateOrDeleteFavoriteProduct) => {
//   const result = await FavoritecreateOrDeleteFavoriteProduct.create(payload);
//   return result;
// };

const getAllFavoriteProductByUserQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const favoriteProductQuery = new QueryBuilder(
    FavoriteProduct.find({ userId }).populate('courseId').populate('articleId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await favoriteProductQuery.modelQuery;

  const allCourses = result.filter((favorite) => favorite.type === "course");
  const allArticles = result.filter((favorite) => favorite.type === 'article');

  const allCourseAndArticles = {
    allCourses,
    allArticles
  }

  const meta = await favoriteProductQuery.countTotal();
  return { meta, result:allCourseAndArticles };
};

// const deleteFavoritecreateOrDeleteFavoriteProduct = async (id: string, userId: string) => {
//   // Fetch the FavoritecreateOrDeleteFavoriteProduct by ID
//   const FavoritecreateOrDeleteFavoriteProduct = await FavoritecreateOrDeleteFavoriteProduct.findById(id);
//   if (!FavoritecreateOrDeleteFavoriteProduct) {
//     throw new AppError(404, 'FavoritecreateOrDeleteFavoriteProduct not found!');
//   }

//   // Fetch the user by ID
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new AppError(404, 'User not found!');
//   }

//   // Ensure the FavoritecreateOrDeleteFavoriteProduct belongs to the user
//   if (FavoritecreateOrDeleteFavoriteProduct.userId.toString() !== userId) {
//     throw new AppError(403, 'You are not authorized to delete this FavoritecreateOrDeleteFavoriteProduct!');
//   }

//   // Delete the FavoritecreateOrDeleteFavoriteProduct
//   const result = await FavoritecreateOrDeleteFavoriteProduct.findByIdAndDelete(id);
//   if (!result) {
//     throw new AppError(500, 'Error deleting FavoritecreateOrDeleteFavoriteProduct!');
//   }

//   return result;
// };

export const favoriteProductService = {
  createOrDeleteFavoriteProduct,
  getAllFavoriteProductByUserQuery,
  // createFavoritecreateOrDeleteFavoriteProduct,
  // deleteFavoritecreateOrDeleteFavoriteProduct,
};
