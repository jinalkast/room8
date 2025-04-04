import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { TCleanlinessTask } from '../types';

const fetchCleanlinessTasks = async (logId?: string): Promise<TCleanlinessTask[] | null> => {
  const url = new URL('/api/cleanliness/tasks', window.location.origin);
  if (logId) {
    url.searchParams.append('logId', logId);
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const json: TApiResponse<TCleanlinessTask[]> = await res.json();
  return json.data ?? null;
};

export default function useGetCleanlinessTasks(logId?: string) {
  return useQuery({
    queryKey: ['cleanliness-tasks', logId],
    queryFn: () => fetchCleanlinessTasks(logId)
  });
}
