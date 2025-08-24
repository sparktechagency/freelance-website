import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { categoryController } from './category.controller';
import fileUpload from '../../middleware/fileUpload';

const upload = fileUpload('./public/uploads/category');

const categoryRoutes = Router();

categoryRoutes
  .post(
    '/create-category',
    
    // auth(USER_ROLE.ADMIN),
    upload.fields([{ name: 'image' }]),
    // upload.single('image'),
    //   validateRequest(paymnetValidation),
    categoryController.createCategory,
  )

  .get('', categoryController.getAllCategory)
  .get(
    '/admin',
    auth(USER_ROLE.ADMIN),
    categoryController.getAllCategoryByAdmin,
  )
  .get('/:id', categoryController.getSingleCategory)
  .patch(
    '/:id',
    // auth(USER_ROLE.ADMIN),
    // upload.fields([{ name: 'image' }]),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    categoryController.updateCategory,
  )
  .patch(
    '/isActive/:id',
    // auth(USER_ROLE.ADMIN),
    categoryController.categoryActiveDeactive,
  )
  .delete('/:id', 
    // auth(USER_ROLE.ADMIN), 
    categoryController.deletedCategory);

export default categoryRoutes;
