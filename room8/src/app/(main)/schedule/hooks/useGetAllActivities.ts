import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { DBtoClientActivities } from '../adapters';
import { TActivity, TActivityAndResponsibleDB } from '../types';

export const fetchAllActivities = async (): Promise<TActivity[] | null> => {
  const res = await fetch(`/api/schedule`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const json: TApiResponse<TActivityAndResponsibleDB[]> = await res.json();

  return json.data?.map((habit) => DBtoClientActivities(habit)) ?? null;
};

export default function useAllActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => fetchAllActivities()
  });
}
