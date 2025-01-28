import { z } from "zod";

export const postBillSchema = z.object({
    name: z.string(),
    amount: z.coerce.number(),
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
}