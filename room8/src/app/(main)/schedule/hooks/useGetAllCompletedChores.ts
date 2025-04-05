import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

type TCompletedChore = {
  id: number;
  created_at: string;
  responsible_id: string;
  responsible: {
    id: string;
    profile_id: string;
    activity_id: string;
    profile: {
      id: string;
      name: string;
      image_url: string;
    };
  };
  chore: {
    chores: {
      id: number;
      title: string;
      description: string;
      time: string;
    };
  };
};

const fetchAllCompletedChores = async (): Promise<TCompletedChore[] | null> => {
  const res = await fetch('/api/schedule/completed', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const json: TApiResponse<TCompletedChore[]> = await res.json();
  return json.data ?? null;
};

export default function useAllCompletedChores() {
  return useQuery({
    queryKey: ['all-completed-chores'],
    queryFn: fetchAllCompletedChores
  });
}
