import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchRemoveRoommate = async (roommateId: string) => {
  const res = await fetch(`/api/house/roommates/${roommateId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Failed to remove roommarte');
  }

  return await res.json();
};

export default function useRemoveRoommate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roommateId: string) => {
      return fetchRemoveRoommate(roommateId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roommates'] });
      queryClient.invalidateQueries({ queryKey: ['house'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: 'Success!',
        description: 'Roommate removed successfully'
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
