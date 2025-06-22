import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TAssignTaskCreator } from './assignTaskCreator.interface';
import AssignTaskCreator from './assignTaskCreator.model';
import Creator from '../creator/creator.model';
import HireCreator from '../hireCreator/hireCreator.model';
import { User } from '../user/user.models';


const createAssignTaskCreator = async (payload: any) => {
  console.log('AssignTaskCreator payload=', payload);

  if (!payload.creatorsIds || !payload.hireCreatorId || !payload.price) {
    throw new AppError(
      403,
      'Creator ID, Hire Creator ID, and price are required',
    );
  }

  const existHireCreator = await HireCreator.findById(payload.hireCreatorId);
  if (!existHireCreator) {
    throw new AppError(404, 'Hire Creator not found');
  }
  if (existHireCreator.status !== 'approved') {
    throw new AppError(404, 'Hire Creator not found');
  }

  if (payload.price <= 0) {
    throw new AppError(400, 'Price must be greater than zero!');
  }

  const creatorData = await Promise.all(
    payload.creatorsIds.map(async (creatorId: string) => {
      const existCreator = await Creator.findById(creatorId);
      if (!existCreator) {
        throw new AppError(404, 'Creator not found');
      }

      const existingAssignTaskCreator = await AssignTaskCreator.findOne({
        creatorId: existCreator._id,
        hireCreatorId: existHireCreator._id,
      });

      if (!existingAssignTaskCreator) {
        return {
          creatorId: existCreator._id,
          creatorUserId: existCreator.userId,
          price: payload.price,
          hireCreatorId: existHireCreator._id,
          hireCreatorUserId: existHireCreator.userId,
        };
      }

      return null;
    }),
  );
console.log('creatorData', creatorData);
  const validCreatorData = creatorData.filter((data) => data !== null);
    console.log('validCreatorData', validCreatorData);

  if (validCreatorData.length === 0) {
    throw new AppError(
      404,
      'No new tasks to assign, all creators are already assigned',
    );
  }

  const result = await AssignTaskCreator.insertMany(validCreatorData);

  if (!result) {
    throw new AppError(403, 'AssignTaskCreator creation failed!');
  }

  return result;
};
  

const getAllAssignTaskCreatorQuery = async (query: Record<string, unknown>) => {
  const AssignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({})
      .populate('creatorId')
      .populate('creatorUserId')
      .populate('hireCreatorId')
      .populate('hireCreatorUserId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AssignTaskCreatorQuery.modelQuery;

  const meta = await AssignTaskCreatorQuery.countTotal();
  return { meta, result };
};


const getAllAssignTaskCreatorOfUserQuery = async (query: Record<string, unknown>, userId:string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(404, 'User not found');
        }

        const updateUserId = user.role === 'creator' ? "creatorUserId" : "hireCreatorUserId" ;


  const AssignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({[updateUserId]: userId})
      .populate('creatorId')
      .populate('creatorUserId')
      .populate('hireCreatorId')
      .populate('hireCreatorUserId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AssignTaskCreatorQuery.modelQuery;

  const meta = await AssignTaskCreatorQuery.countTotal();
  return { meta, result };
};

const getSingleAssignTaskCreatorQuery = async (id: string) => {
  const assignTaskCreator: any = await AssignTaskCreator.findById(id)
    .populate('creatorId')
    .populate('creatorUserId')
    .populate('hireCreatorId')
    .populate('hireCreatorUserId');
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }
  return assignTaskCreator;
};


const singleAssignTaskCreatorApprovedCancelQuery = async (
  id: string,
  status: any,
) => {
  console.log('id', id);
  console.log('updated status', status);
  const assignTaskCreatorProduct: any = await AssignTaskCreator.findById(id);
  if (!assignTaskCreatorProduct) {
    throw new AppError(404, 'AssignTaskCreator is not found!');
  }

  if (status === 'request_approved') {
    if (assignTaskCreatorProduct.status === 'request_approved') {
      throw new AppError(403, 'AssignTaskCreator is already approved!');
    }
    const result = await AssignTaskCreator.findByIdAndUpdate(
      id,
      { status: 'request_approved' },
      {
        new: true,
      },
    );

    if (!result) {
      throw new AppError(403, 'updated faild!!');
    }

    return result;
  } else {
    if (assignTaskCreatorProduct.status === 'cancel') {
      throw new AppError(403, 'AssignTaskCreator is already cancel!');
    }

    const result = await AssignTaskCreator.findByIdAndDelete(id);

    if (!result) {
      throw new AppError(403, 'AssignTaskCreator updated faild!!');
    }

    return result;
  }

  
};

const deletedAssignTaskCreatorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const assignTaskCreator = await AssignTaskCreator.findById(id);
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }

  const result = await AssignTaskCreator.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'AssignTaskCreator Result Not Found !');
  }

  return result;
};

export const assignTaskCreatorService = {
  createAssignTaskCreator,
  getAllAssignTaskCreatorQuery,
  getAllAssignTaskCreatorOfUserQuery,
  getSingleAssignTaskCreatorQuery,
  singleAssignTaskCreatorApprovedCancelQuery,
  deletedAssignTaskCreatorQuery,
};
