import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { IProject } from './project.interface';
import { Project } from './project.model';

const createProject = async (payload: IProject) => {
  const exists = await Project.findOne({ name: payload.name });
  if (exists) {
    throw new AppError(403, 'Project already exists!!');
  }
  const result = await Project.create(payload);
  return result;
};

const getAllProjectQuery = async (userid: string, query: Record<string, unknown>) => {
  const ProjectQuery = new QueryBuilder(
    Project.find({ isDeleted: false, userId: userid }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ProjectQuery.modelQuery;
  const meta = await ProjectQuery.countTotal();
  return { meta, result };
};

const getAllProjectByFreelancerId = async (
  freelancerId: string,
) => {
 const result = await Project.find({ userId: freelancerId, isDeleted: false });
  return result;
};



const getSingleProject = async (id: string) => {
  const project = await Project.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  mongoose;
  if (project.length === 0) {
    throw new AppError(404, 'Project not found!');
  }

  return project[0];
};

const updateProject = async (id: string, userId: string, payload: Partial<IProject>) => {
  // console.log('id ', id);
  // console.log('payload ', payload);

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError(404, 'Project is not found!');
  }
  if (project.userId.toString() !== userId) {
    throw new AppError(404, 'You are not authorized to update this Project!');
  }
  console.log({ payload });

  if (Object.keys(payload).length === 0) {
    throw new AppError(404, 'Payload is not found!');
  }

  const result = await Project.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};


const deleteProject = async (id: string) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new AppError(404, 'Project is not found!');
  }

  // Delete the SaveStory
  const result = await Project.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const projectService = {
  createProject,
  getAllProjectQuery,
  getAllProjectByFreelancerId,
  getSingleProject,
  updateProject,
  deleteProject,
};
