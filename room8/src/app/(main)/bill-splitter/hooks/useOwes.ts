import { TOwe } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchOwes = async (): Promise<TOwe[] | null> => {
  const res = await fetch(`/api/bills/owes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Error fetching owes - Response was not ok');
  }

  const json = await res.json();
  return json.data ?? null;
};

export default function useOwes() {
  return useQuery({
    queryKey: ['owes'],
    queryFn: async () => fetchOwes()
  });
}
