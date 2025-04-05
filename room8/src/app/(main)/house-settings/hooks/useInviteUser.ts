import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TInviteBody } from '../types';

export const fetchInviteUser = async (invite: TInviteBody) => {
  const res = await fetch(`/api/house/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invite)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to invite user');
  }

  return res.json();
};

export default function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invite: TInviteBody) => {
      return fetchInviteUser(invite);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'User invited successfully'
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
