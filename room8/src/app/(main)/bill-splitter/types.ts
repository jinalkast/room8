import { z } from 'zod';

export const postBillSchema = z.object({
  name: z.string().nonempty('Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
  owed_by: z.date().optional(),
  equally: z.boolean(),
  owes: z.map(z.string(), z.number())
});

export const postBillPresetSchema = z.object({
  name: z.string().nonempty('Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
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

export type TBillPreset = {
  id: string;
  name: string;
  amount: number;
  owed_by?: Date | undefined;
  owes: Map<string, number>;
}
