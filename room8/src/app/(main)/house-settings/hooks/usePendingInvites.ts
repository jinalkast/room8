import { TPendingInvite } from '@/app/(main)/house-settings/types';
import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchInvites = async (): Promise<TPendingInvite[]> => {
  const res = await fetch(`/api/house/invite/pending`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json: TApiResponse<TPendingInvite[]> = await res.json();
  console.log(json);
  return (
    json.data?.map((invite) => {
      return {
        id: invite.id,
        house_id: invite.house_id,
        inviter_id: invite.inviter_id,
        invited_user: invite.invited_user,
        created_at: invite.created_at,
        user_id: invite.user_id,
      };
    }) ?? []
  );
};

export default function useGetInvites() {
  return useQuery({
    queryKey: ['pendingInvites'],
    queryFn: async () => fetchInvites(),
    staleTime: 0
  });
}
