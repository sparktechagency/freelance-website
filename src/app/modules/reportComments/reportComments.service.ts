import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import ReportComments from './reportComments.model';
import Message from '../message/message.model';
// import Comments from '../comments/comments.model';

const createReportCommentOrReply = async (payload: {
  commentId?: string;
  userId: string;
}) => {

  // const message = await Comments.findById(payload.commentId);
  // if (!message) {
  //   throw new AppError(404, 'Message Not Found!!');
  // }

  // const existingReportcomment = await ReportComments.findOne({
  //   commentId: message._id,
  //   userId: payload.userId,
  // });
  // if (existingReportcomment) {
  //   throw new AppError(400, 'You have already reported this comment!');
  // }

  const reportcomment = await ReportComments.create(payload);
  return reportcomment;
};

const getAllReportCommentByDoctorQuery = async (query: Record<string, unknown>) => {

 const QcreateQuestionnaireQuery = new QueryBuilder(
   ReportComments.find().populate('commentId').populate({path: 'userId', select: 'fullName profile email role'}),
   query,
 )
   .search([])
   .filter()
   .sort()
   .paginate()
   .fields();

 const result = await QcreateQuestionnaireQuery.modelQuery;

 const meta = await QcreateQuestionnaireQuery.countTotal();
 return { meta, result };
  
};

const getSingleReportCommentQuery = async (id: string) => {
  const reportcomment: any = await ReportComments.findById(id)
    .populate('commentId')
    .populate({ path: 'userId', select: 'fullName profile email role' });
  if (!reportcomment) {
    throw new AppError(404, 'ReportComment Not Found!!');
  }
  return reportcomment;
};


const updateSingleReportCommentQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const reportcomment: any = await ReportComments.findById(id);
  if (!reportcomment) {
    throw new AppError(404, 'ReportComment is not found!');
  }

  const result = await ReportComments.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'ReportComment updated faild!!');
  }

  return result;
};

const deletedReportCommentQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const reportcomment = await ReportComments.findById(id);
  if (!reportcomment) {
    throw new AppError(404, 'ReportComment Not Found!!');
  }

  const result = await ReportComments.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'ReportComment Result Not Found !');
  }

  return result;
};

export const reportcommentService = {
  createReportCommentOrReply,
  getAllReportCommentByDoctorQuery,
  getSingleReportCommentQuery,
  updateSingleReportCommentQuery,
  deletedReportCommentQuery,
};
