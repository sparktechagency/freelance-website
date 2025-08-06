

import { z } from 'zod';

const doctorBookingCreateValidation = z.object({
  body: z.object({
   
  }),
});

export const doctorBookingValidation = {
  doctorBookingCreateValidation,
};
