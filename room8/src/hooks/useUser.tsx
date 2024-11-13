import { useQuery } from '@tanstack/react-query';
import { TUser } from '@/lib/types';

export const fetchUser = async (): Promise<TUser | null> => {
  const res = await fetch(`/api/house/roommates`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();

  return json.data ?? null;
};

export default function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => fetchUser()
  });
}