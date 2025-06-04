import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPackage } from './package.interface';
import Package from './package.model';
import { access, unlink } from 'fs/promises';


  const createPackage = async (payload: TPackage) => {
    try {
      const result = await Package.create(payload);
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

const getAllPackageQuery = async (query: Record<string, unknown>) => {
  const packageQuery = new QueryBuilder(Package.find({isDeleted: false}), query)
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
  const PackagePackage: any = await Package.findById(id);
  if (!PackagePackage) {
    throw new AppError(404, 'Package Not Found!!');
  }
  return PackagePackage;
};

const updateSinglePackageQuery = async (id: string, payload: any) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing package by ID
    const existingPackage: any = await Package.findById(id);
    if (!existingPackage) {
      throw new AppError(404, 'Package not found!');
    }

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(id, payload, {
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

const deletedPackageQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const packagePackage = await Package.findById(id);
  if (!packagePackage) {
    throw new AppError(404, 'Package Not Found!!');
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
  getSinglePackageQuery,
  updateSinglePackageQuery,
  deletedPackageQuery,
};
