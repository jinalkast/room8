import { TBill } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchBills = async (): Promise<TBill[] | null> => {
  const res = await fetch(`/api/bills`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Error fetching bills - Response was not ok');
  }

  const json = await res.json();
  return json.data ?? null;
};

export default function useBills() {
  return useQuery({
    queryKey: ['bills'],
    queryFn: async () => fetchBills()
  });
}
