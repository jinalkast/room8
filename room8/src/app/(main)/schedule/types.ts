import { Database } from '@/lib/types/supabase';

export type TActivityDB = Database['public']['Tables']['chores']['Row'];
export type TActivityAndResponsibleDB = TActivityDB & {
  responsible: string[];
};

export type TActivity = {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  time: string;
  houseId: string;
  responsible: any[];
};
