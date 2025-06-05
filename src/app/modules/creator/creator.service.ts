import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCreator } from './creator.interface';
import Creator from './creator.model';
import { uploadManyToS3, uploadToS3 } from '../../utils/s3';

const createCreator = async (files: any, payload: TCreator) => {
  console.log('Creator payload=', payload);

  if (!files) {
    throw new AppError(403, 'At least one File is required');
  }

  // aws s3 upload

  const introductionVideo = await uploadToS3(files.introductionvideo[0]);
  const ugcExampleVideo = await uploadManyToS3(files.ugcExampleVideo);

//   const result = await Creator.create(payload);

//   if (!result) {
//     throw new AppError(403, 'Creator create faild!!');
//   }

  return 'result';
};

const getAllCreatorQuery = async (query: Record<string, unknown>) => {
  const CreatorQuery = new QueryBuilder(Creator.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CreatorQuery.modelQuery;

  const meta = await CreatorQuery.countTotal();
  return { meta, result };
};

const getSingleCreatorQuery = async (id: string) => {
  const creator: any = await Creator.findById(id);
  if (!creator) {
    throw new AppError(404, 'Creator Not Found!!');
  }
  return creator;
};

const updateSingleCreatorQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const creatorProduct: any = await Creator.findById(id);
  if (!creatorProduct) {
    throw new AppError(404, 'Creator is not found!');
  }

  const result = await Creator.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Creator updated faild!!');
  }

  return result;
};

const deletedCreatorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const creator = await Creator.findById(id);
  if (!creator) {
    throw new AppError(404, 'Creator Not Found!!');
  }

  const result = await Creator.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Creator Result Not Found !');
  }

  return result;
};

export const creatorService = {
  createCreator,
  getAllCreatorQuery,
  getSingleCreatorQuery,
  updateSingleCreatorQuery,
  deletedCreatorQuery,
};
