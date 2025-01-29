import { Json } from '@/lib/types/supabase';
import { useMutation } from '@tanstack/react-query';
import useRoommates from '../../../../hooks/useRoommates';
import { TRoommate } from '@/lib/types';

export const activateChatbot = async (roommates: TRoommate[] | null): Promise<Json | null> => {
  const phoneList = roommates
    ? roommates.map((roommate) => roommate.phone).filter((phone) => phone != 'NULL')
    : [];
  const res = await fetch(`/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participants: phoneList })
  });

  const json = await res.json();
  return json ?? null;
};

export default function useActivateChatbot() {
  const { data: roommates } = useRoommates();

  return useMutation({
    mutationFn: () => {
      if (!roommates) {
        throw new Error('Error getting roommates');
      }
      return activateChatbot(roommates);
    }
  });
}
