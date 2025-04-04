import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

type TCompletedChore = {
  id: number;
  created_at: string;
  responsible_id: string;
  profile_id: string | null;
};

const fetchCompletedChores = async (choreId: number): Promise<TCompletedChore[] | null> => {
  const res = await fetch(`/api/schedule/${choreId}/completed`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const json: TApiResponse<TCompletedChore[]> = await res.json();
  return json.data ?? null;
};

export default function useCompletedChores(choreId: number) {
  return useQuery({
    queryKey: ['completed-chores', choreId],
    queryFn: () => fetchCompletedChores(choreId)
  });
}
