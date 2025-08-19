import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { ICategory } from './category.interface';
import { Category } from './category.model';


const createCategory = async (payload:ICategory) => {
  
  const exists = await Category.findOne({ name: payload.name });
  if (exists) {
    throw new AppError(403, 'Category already exists!!');
  }
  const result = await Category.create(payload);
  return result;
};

const getAllCategoryQuery = async (
  query: Record<string, unknown>,
) => {
  const CategoryQuery = new QueryBuilder(
    Category.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CategoryQuery.modelQuery;
  const meta = await CategoryQuery.countTotal();
  return { meta, result };
};


const getAllCategoryByAdminQuery = async (
  query: Record<string, unknown>,
) => {
  const CategoryQuery = new QueryBuilder(
    Category.find({ isDeleted: false }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CategoryQuery.modelQuery;
  const meta = await CategoryQuery.countTotal();
  return { meta, result };
};

const getSingleCategory = async (id: string) => {
  const category = await Category.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);mongoose
  if (category.length === 0) {
    throw new AppError(404, 'Category not found!');
  }

  return category[0];
};


const updateCategory = async (id: string, payload:Partial<ICategory>) => {
  // console.log('id ', id);
  // console.log('payload ', payload);
 
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(404, 'Category is not found!');
  }
  console.log({payload});
  

  if(Object.keys(payload).length === 0){
    throw new AppError(404, 'Payload is not found!');

  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};


const categoryActiveDeactiveService = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(404, 'Category is not found!');
  }

  let status;

  if(category.isActive){
    status=false;
  }else{
    status = true;
  }
  const result = await Category.findByIdAndUpdate(id,{isActive:status},{new:true});
  let message;
  if(result?.isActive){
    message = 'Category actived successful';
  }else{
    message = 'Category deactive successful';
  }
  return {result, message};
};


const deleteCategory = async (id: string) => {
 
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(404, 'Category is not found!');
  }

  // Delete the SaveStory
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategoryQuery,
  getAllCategoryByAdminQuery,
  getSingleCategory,
  updateCategory,
  categoryActiveDeactiveService,
  deleteCategory,
  
};


