import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TInvoices } from './invoices.interface';
import Invoice from './invoices.model';
import { User } from '../user/user.models';
import { Tender } from '../tenders/tenders.model';
import mongoose from 'mongoose';

const createInvoice = async (payload: TInvoices) => {
  console.log('Invoice payload=', payload);

  const client = await User.findById(payload.clientUserId);
  if (client?.role !== 'client') {
    throw new AppError(403, 'Client not found!!');
  }

  if(payload.invoiceType === 'tender'){
    if(!payload.tenderId){
      throw new AppError(403, 'tender id required!');
    }

    const tender = await Tender.findById(payload.tenderId);
    if (!tender) {
      throw new AppError(403, 'Tender not found!!');
    }

    const invoice = await Invoice.findOne({tenderId: payload.tenderId, freelancerUserId: payload.freelancerUserId});
    if (invoice) {
      throw new AppError(403, 'Invoice already exist!!');
    }

    const invoiceApproved = await Invoice.findOne({
      tenderId: payload.tenderId,
      status: 'accepted',
    });

    if (invoiceApproved) {
      throw new AppError(403, 'Invoice already accepted!!');
    }


}


  const result = await Invoice.create(payload);

  if (!result) {
    throw new AppError(403, 'Invoice create faild!!');
  }

  return result;
};

const getAllInvoiceByClientQuery = async (query: Record<string, unknown>, userId: string) => {
  const InvoiceQuery = new QueryBuilder(Invoice.find({clientUserId: userId}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await InvoiceQuery.modelQuery;

  const meta = await InvoiceQuery.countTotal();
  return { meta, result };
};

const getAllInvoiceByFreelancerQuery = async (query: Record<string, unknown>, userId: string) => {
  const InvoiceQuery = new QueryBuilder(Invoice.find({freelancerUserId: userId}), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await InvoiceQuery.modelQuery;

  const meta = await InvoiceQuery.countTotal();
  return { meta, result };
};

const getSingleInvoiceQuery = async (id: string) => {
  const invoice: any = await Invoice.findById(id);
  if (!invoice) {
    throw new AppError(404, 'Invoice Not Found!!');
  }
  return Invoice;
};

const updateSingleInvoiceQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const InvoiceProduct: any = await Invoice.findById(id);
  if (!InvoiceProduct) {
    throw new AppError(404, 'Invoice is not found!');
  }

  const result = await Invoice.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Invoice updated faild!!');
  }

  return result;
};

const invoiceApprove = async (clientUserId: string, id: string) => {
  console.log('id', id);
  console.log('clientUserId', clientUserId);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const invoice: any = await Invoice.findById(id).session(session);
    if (!invoice) {
      throw new AppError(404, 'Invoice is not found!');
    }

    if (invoice.clientUserId.toString() !== clientUserId) {
      throw new AppError(404, 'You are not authorized to update this Invoice!');
    }

    if (invoice.status === 'accepted') {
      throw new AppError(404, 'Invoice already accepted!');
    }

    const result = await Invoice.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { new: true, session },
    );
    if (!result) {
      throw new AppError(403, 'Invoice update failed!');
    }

    const tender = await Tender.findById(invoice.tenderId).session(session);
    if (!tender) {
      throw new AppError(404, 'Tender is not found!');
    }

    const updateTender = await Tender.findByIdAndUpdate(
      tender._id,
      { status: 'running' },
      { new: true, session },
    );

    if (!updateTender) {
      throw new AppError(403, 'Tender update failed!');
    }

    if (result) {
      const tenderInvoices = await Invoice.find({
        tenderId: result.tenderId,
      }).session(session);
      if (tenderInvoices && tenderInvoices.length > 0) {
        await Invoice.updateMany(
          { tenderId: result.tenderId },
          { status: 'declined' },
          { session },
        );
      }

    }

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const deletedInvoiceQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new AppError(404, 'Invoice Not Found!!');
  }

  const result = await Invoice.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Invoice Result Not Found !');
  }

  return result;
};

export const invoiceService = {
  createInvoice,
  getAllInvoiceByClientQuery,
  getAllInvoiceByFreelancerQuery,
  getSingleInvoiceQuery,
  updateSingleInvoiceQuery,
  invoiceApprove,
  deletedInvoiceQuery,
};
