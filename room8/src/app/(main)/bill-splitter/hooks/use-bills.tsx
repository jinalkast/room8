import { useQuery } from '@tanstack/react-query';
import { TBill } from '@/lib/types/types';

export const fetchBills = async (): Promise<TBill[] | null> => {
  const res = await fetch(`/api/bills`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();

  return json.data ?? null;
};

export default function useBills() {
  return useQuery({
    queryKey: ['bills'],
    queryFn: async () => fetchBills()
  });
}
