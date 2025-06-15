import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { access, unlink } from 'fs/promises';
import { User } from '../user/user.models';
import { TBrand } from './brand.interface';
import Brand from './brand.model';

const createBrand = async (files: any, payload: TBrand, userId: string) => {
  try {
    console.log('Brand payload=', payload);
    console.log('Brand files=', files);

    if (!files) {
      throw new AppError(403, 'At least one File is required');
    }

    // aws s3 upload

    // const introductionVideo = await uploadToS3({file:files.introductionvideo[0], fileName:files.introductionvideo[0].originalname});
    // const ugcExampleVideo = await uploadManyToS3(files.ugcExampleVideo);

    // console.log('introductionVideo', introductionVideo);
    // console.log('ugcExampleVideo', ugcExampleVideo);

    // if(payload.introductionvideo){
    //   // const introductionVideo = await uploadToS3({file:files.introductionvideo[0], fileName:files.introductionvideo[0].originalname});
    //   // payload.introductionvideo = introductionVideo;
    // }

    if (files?.ugcPhotos && files.ugcPhotos.length > 0) {
      payload.ugcPhotos = files.ugcPhotos.map((file: any) =>
        file.path.replace(/^public[\\/]/, ''),
      );
    }

    // const user = await User.findById(userId);

    // if (!user) {
    //   throw new AppError(404, 'User not found!');
    // }
   
    const result = await Brand.create(payload);

    // if (result) {
    //   await User.updateOne(
    //     { _id: user._id },
    //     { $set: { brandId: result._id } },
    //   );
    // }

    if (!result) {
      throw new AppError(403, 'Brand create faild!!');
    }

    return result;
  } catch (error) {
  
    const allVideo = files.ugcPhotos.map(
      (video: any) => `public/${video.path}`,
    );
    await Promise.all(allVideo.map((path: any) => unlink(path)));
  }
};

const getAllBrandQuery = async (query: Record<string, unknown>) => {
  const BrandQuery = new QueryBuilder(Brand.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await BrandQuery.modelQuery;

  const meta = await BrandQuery.countTotal();
  return { meta, result };
};

const getSingleBrandQuery = async (id: string) => {
  const brand: any = await Brand.findById(id);
  if (!brand) {
    throw new AppError(404, 'Brand Not Found!!');
  }
  return brand;
};

const updateSingleBrandQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const BrandProduct: any = await Brand.findById(id);
  if (!BrandProduct) {
    throw new AppError(404, 'Brand is not found!');
  }

  const result = await Brand.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Brand updated faild!!');
  }

  return result;
};

const deletedBrandQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError(404, 'Brand Not Found!!');
  }

  const result = await Brand.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Brand Result Not Found !');
  }

  return result;
};

export const brandService = {
  createBrand,
  getAllBrandQuery,
  getSingleBrandQuery,
  updateSingleBrandQuery,
  deletedBrandQuery,
};
