import { useQuery } from '@tanstack/react-query';
import { TActivity, TActivityAndResponsibleDB } from '../types';
import { TApiResponse } from '@/lib/types';
import { DBtoClientActivities } from '../adapters';

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
