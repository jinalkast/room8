import { Json } from '@/lib/types/supabase';
import { useMutation } from '@tanstack/react-query';
import useRoommates from '../../../../hooks/useRoommates';
import useGetHouse from '@/hooks/useGetHouse';
import { TRoommate } from '@/lib/types';
import { THouse } from '../../house-settings/types';

export const activateChatbot = async (
  roommates: TRoommate[] | null,
  house: THouse | null
): Promise<Json | null> => {
  const phoneList = roommates
    ? roommates.map((roommate) => roommate.phone).filter((phone) => phone != 'NULL')
    : [];
  const houseId = house ? house.id : '';
  const res = await fetch(`/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participants: phoneList, house: houseId })
  });

  const json = await res.json();
  return json ?? null;
};

export default function useActivateChatbot() {
  const { data: roommates } = useRoommates();
  const { data: house } = useGetHouse();

  return useMutation({
    mutationFn: () => {
      if (!roommates) {
        throw new Error('Error getting roommates');
      }
      if (!house) {
        throw new Error('Error getting house');
      }
      return activateChatbot(roommates, house);
    }
  });
}
