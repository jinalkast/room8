import { TRoommate, TRoommateDB } from '@/lib/types';
import { Tables, TablesInsert } from '@/lib/types/supabase';

export type THouseDB = Tables<'houses'>;
export type THouseInsertDB = TablesInsert<'houses'>;
export type TInviteDB = Tables<'house_invites'> & { inviter: TRoommateDB } & { house: THouseDB };
export type TNoteDB = Tables<'notes'>;

export type TCameraBody = {
  cameraId: string;
};

export type THouseBody = {
  address: string;
  name: string;
};

export type THouse = {
  id: string;
  owner: string;
  name: string;
  address: string;
  chatbotActive: boolean;
  cameraId: string | null;
};

export type TNote = {
  createdAt: string;
  favourited: boolean;
  houseId: string;
  id: number;
  posterId: string;
  text: string;
};

export type TNoteBody = {
  favourited: boolean;
  text: string;
};

export type TInviteBody = {
  userEmail: string;
  inviterId: string;
  houseId: string;
};

export type TInvite = {
  house: THouse;
  id: number;
  inviter: TRoommate;
  userId: string;
};

export type TPendingInvite = Tables<'house_invites'> & { invited_user: TRoommateDB };
