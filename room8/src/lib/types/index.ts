import { Database, Tables } from './supabase';

export type THabitDB = Tables<'chores'>;
export type TBillDB = Tables<'bills'>;
export type TOweDB = Tables<'owes'>;
export type TAmountOwedDB = Tables<'amounts_owed'>;
export type TRoommateDB = Tables<'profiles'>;

export type TApiResponse<T> = {
  data: T | null;
  message?: string;
};

export type TRoommate = {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  houseId?: string;
  phone?: string;
};

export type TOwe = {
  amount_owed: number;
  bill_id: string;
  bill_name: string;
  bill_total: number;
  debtor_id: string;
  debtor_name: string;
  loaner_id: string;
  loaner_name: string;
  owe_id: string;
  owed_by: string;
  paid: boolean;
};

export type TBill = {
  bill_id: string;
  bill_name: string;
  sum_paid_back: number;
  total_owed: number;
};
