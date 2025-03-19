import { useQuery } from '@tanstack/react-query';
import { TApiResponse } from '@/lib/types';

export type TCleanlinessTask = {
  id: number;
  created_at: string;
  name: string;
  cl_log_id: string;
  assigned_to_id: string;
  assigned_by_id: string;
  status: 'unassigned' | 'pending' | 'completed' | 'dismissed';
  assigned_by: {
    id: string;
    name: string;
    image_url: string | null;
  };
  assigned_to: {
    id: string;
    name: string;
    image_url: string | null;
  };
  completed_by: {
    id: string;
    name: string;
    image_url: string | null;
  };
  cleanliness_log: {
    id: string;
    house_id: string;
    created_at: string;
    after_image_url: string;
    before_image_url: string;
  };
};

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
