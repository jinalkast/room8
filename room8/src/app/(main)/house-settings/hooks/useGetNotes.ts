import { TNote, TNoteDB } from '@/app/(main)/house-settings/types';
import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchNotes = async (): Promise<TNote[]> => {
  const res = await fetch(`/api/house/notes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json: TApiResponse<TNoteDB[]> = await res.json();

  return (
    json.data?.map((note) => ({
      id: note.id,
      text: note.text,
      favourited: note.favourited,
      createdAt: note.created_at,
      posterId: note.poster_id,
      houseId: note.house_id
    })) ?? []
  );
};

export default function useGetNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => fetchNotes()
  });
}
