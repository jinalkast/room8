import { TActivity } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchAllActivities = async () => {
  const res = await fetch(`/api/schedule`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const json = await res.json();

  return json.data as TActivity[];
};

export default function useAllActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => fetchAllActivities()
  });
}
