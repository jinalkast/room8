import { useQuery } from '@tanstack/react-query';
import { TDebt } from '@/lib/types/types';

export const fetchDebts = async (): Promise<TDebt[] | null> => {
  const res = await fetch(`/api/debts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();

  return json.data ?? null;
};

export default function useDebts() {
  return useQuery({
    queryKey: ['debts'],
    queryFn: async () => fetchDebts()
  });
}
