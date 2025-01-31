import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchDeclineInvite = async (inviteId: number) => {
  const res = await fetch(`/api/house/invite/decline/${inviteId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to decline invite');
  }

  return await res.json();
};

export default function useDeclineInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => {
      return fetchDeclineInvite(inviteId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      toast({
        title: 'Success!',
        description: 'Invite declined successfully'
      });
    },
    onError: (err) => {
      toast({
        title: 'Error!',
        description: err.message
      });
    }
  });
}
