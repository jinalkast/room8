import { TApiResponse, TRoommate, TRoommateDB } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchRoommates = async (): Promise<TRoommate[] | null> => {
  const res = await fetch(`/api/house/roommates`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json: TApiResponse<TRoommateDB[]> = await res.json();

  return (
    json.data?.map((roommate: TRoommateDB): TRoommate => {
      return {
        id: roommate.id,
        houseId: roommate.house_id ?? undefined,
        name: roommate.name,
        imageUrl: roommate.image_url,
        email: roommate.email,
        phone: roommate.phone ?? undefined
      };
    }) ?? null
  );
};

export default function useRoommates() {
  return useQuery({
    queryKey: ['roommates'],
    queryFn: async () => fetchRoommates()
  });
}
