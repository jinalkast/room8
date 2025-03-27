import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/useToast';
import { updateProfilePayload } from '../types';

export const patchProfile = async ({
  userID,
  payload
}: {
  userID: string;
  payload: updateProfilePayload;
}) => {
  if (!userID) {
    throw new Error('Could not detect an auth session');
  }

  const res = await fetch(`/api/profile/${userID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to edit house');
  }

  return res.json();
};

export default function useEditProfile({ onSuccessCallback }: { onSuccessCallback?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userID, payload }: { userID: string; payload: updateProfilePayload }) =>
      patchProfile({ userID, payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Profile Updated successfully'
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
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
