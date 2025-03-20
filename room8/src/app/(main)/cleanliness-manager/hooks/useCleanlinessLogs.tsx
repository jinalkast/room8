import { TApiResponse, TCleanlinessLog } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { useQuery } from '@tanstack/react-query';

export const fetchCleanlinessLogs = async (houseID: string): Promise<TCleanlinessLog[]> => {
  const searchParams = new URLSearchParams({ houseID });
  const res = await fetch(`/api/cleanliness?` + searchParams.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Error fetching cleanliness logs - Response was not ok');
  }

  const json: TApiResponse<Tables<'cleanliness_logs'>[]> = await res.json();
  return (
    json.data?.map((log) => {
      return {
        id: log.id,
        before_image_url: log.before_image_url,
        after_image_url: log.after_image_url,
        created_at: log.created_at
      };
    }) ?? []
  );
};

export default function useCleanlinessLogs({
  params,
  enabled
}: {
  params: { houseID: string };
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['cleanliness-logs'],
    enabled: enabled,
    queryFn: async () => fetchCleanlinessLogs(params.houseID)
  });
}
