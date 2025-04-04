import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteInvite = async ({
  inviteID
}: {
  inviteID: string;
}): Promise<Tables<'house_invites'>> => {
  const res = await fetch(`/api/house/invite/pending/${inviteID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  const json: TApiResponse<Tables<'house_invites'>> = await res.json();
  return json.data!;
};

export default function useDeleteInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['pendingInvites'],
    mutationFn: deleteInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
    }
  });
}
