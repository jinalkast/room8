import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { useQuery } from '@tanstack/react-query';

type CleanlinessStats = Tables<'profiles'> & {
  assignedToTasks: number;
  completedByTasks: number;
  assignedByTasks: number;
};

export const fetchCleanlinessStats = async (): Promise<CleanlinessStats[]> => {
  const res = await fetch('/api/cleanliness/stats', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Error fetching cleanliness stats - Response was not ok');
  }

  const json: TApiResponse<CleanlinessStats[]> = await res.json();
  return json.data ?? [];
};

export default function useCleanlinessStats({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['cleanliness-stats'],
    enabled,
    queryFn: fetchCleanlinessStats
  });
}
