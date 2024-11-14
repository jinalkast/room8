import { Database } from './supabase';

export type THabitDB = Database['public']['Tables']['activities']['Row'];

export type TRoommate = {
  id: string;
  name: string;
  image_url: string;
};

export type TActivity = {
  id: string;
  title: string;
  description: string | null;
  time: string;
  responsible: any[];
};
