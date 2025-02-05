import { z } from 'zod';

export const postBillSchema = z.object({
  name: z.string().nonempty('Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
  equally: z.boolean(),
  owes: z.map(z.string(), z.number())
});

export type TBillHistory = {
  owe_id: string;
  debtor: string;
  loaner: string;
  amount_paid: number;
  date_paid: string;
  bill_name: string;
};
