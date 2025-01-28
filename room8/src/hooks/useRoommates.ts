import { TRoommate } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchRoommates = async (): Promise<TRoommate[] | null> => {
  const res = await fetch(`/api/house/roommates`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();

  return json.data ?? null;
};

export default function useRoommates() {
  return useQuery({
    queryKey: ['roommates'],
    queryFn: async () => fetchRoommates()
  });
}
