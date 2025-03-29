import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchAcceptInvite = async (inviteId: number) => {
  const res = await fetch(`/api/house/invite/accept/${inviteId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to accept invite');
  }

  return res.json();
};

export default function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => {
      return fetchAcceptInvite(inviteId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roommates'] });
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['house'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      toast({
        variant: 'success',
        title: 'Success!',
        description: "You've successfully joined the house"
      });
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: err.message
      });
    }
  });
}
