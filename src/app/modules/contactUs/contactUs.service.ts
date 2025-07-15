import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TContactUs } from './contactUs.interface';
import ContactUs from './contactUs.model';

const createContactUs = async (payload: TContactUs) => {
  console.log('ContactUs payload=', payload);

  const result = await ContactUs.create(payload);

  if (!result) {
    throw new AppError(403, 'ContactUs create faild!!');
  }

  return result;
};

const getAllContactUsQuery = async (query: Record<string, unknown>) => {
  const contactUsQuery = new QueryBuilder(
    ContactUs.find(),
    query,
  )

    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await contactUsQuery.modelQuery;

  const meta = await contactUsQuery.countTotal();
  return { meta, result };
};

const singleContactUs = async (id:string) => {
  const singleContact = await ContactUs.findById(id);
  if (!singleContact) {
    throw new AppError(404, "Contct us not found!")
  }
  return singleContact;
};
const singleStatusContactUs = async (id: string) => {
  const singleContact = await ContactUs.findById(id);
  if (!singleContact) {
    throw new AppError(404, 'Contct us not found!');
  }
  if (singleContact.status === "solved") {
    throw new AppError(403, 'Contact us is already Solved!');
  }



  const result = await ContactUs.findByIdAndUpdate(id, {status:"solved"},{new:true});
  return result;
};
const singleDeleteContactUs = async (id: string) => {
  const singleContact = await ContactUs.findById(id);
  if (!singleContact) {
    throw new AppError(404, 'Contct us not found!');
  }
  if (singleContact.status === 'pending') {
    throw new AppError(403, 'That is pending, that why you do not delete it!');
  }

  const result = await ContactUs.findByIdAndDelete(id);
  return result;
};

export const contactUsService = {
  createContactUs,
  getAllContactUsQuery,
  singleContactUs,
  singleStatusContactUs,
  singleDeleteContactUs,
};
