import { Database } from './supabase';

export type THabitDB = Database['public']['Tables']['activities']['Row'];

export type TApiResponse<T> = {
  data: T | null;
  message?: string;
};

export type TRoommate = {
  id: string;
  name: string;
  image_url: string;
  phone: string;
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
