import { TInvite, TInviteDB } from '@/app/(main)/house-settings/types';
import { TApiResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const fetchInvites = async (): Promise<TInvite[] | null> => {
  const res = await fetch(`/api/house/invite`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json: TApiResponse<TInviteDB[]> = await res.json();

  return (
    json.data?.map((invite): TInvite => {
      return {
        id: invite.id,
        house: {
          id: invite.house_id,
          owner: invite.house.owner,
          name: invite.house.name,
          address: invite.house.address,
          chatbotActive: invite.house.chatbot_active
        },
        inviter: {
          id: invite.inviter.id,
          email: invite.inviter.email,
          name: invite.inviter.name,
          imageUrl: invite.inviter.image_url,
          phone: invite.inviter.phone ?? undefined,
          houseId: invite.inviter.house_id ?? undefined
        },
        userId: invite.user_id
      };
    }) ?? null
  );
};

export default function useGetInvites() {
  return useQuery({
    queryKey: ['invites'],
    queryFn: async () => fetchInvites()
  });
}
