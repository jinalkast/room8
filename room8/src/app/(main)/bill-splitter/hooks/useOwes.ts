import { useQuery } from '@tanstack/react-query';
import { TOwe } from '@/lib/types/types';

export const fetchOwes = async (): Promise<TOwe[] | null> => {
  const res = await fetch(`/api/bills/owes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();

  return json.data ?? null;
};

export default function useOwes() {
  return useQuery({
    queryKey: ['owes'],
    queryFn: async () => fetchOwes()
  });
}
