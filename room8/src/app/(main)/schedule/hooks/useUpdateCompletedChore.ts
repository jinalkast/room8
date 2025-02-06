import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateChorePayload {
  id: number;
  userId: string;
  isCompleted: boolean;
}

const fetchUpdateCompletedChore = async ({ id, userId, isCompleted }: UpdateChorePayload) => {
  const res = await fetch(`/api/schedule/${id}/completed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, isCompleted })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update chore completion status');
  }

  return res.json();
};

export default function useUpdateCompletedChore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateChorePayload) => {
      return fetchUpdateCompletedChore(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['completed-chores', variables.id] });
      toast({
        title: 'Success!',
        description: variables.isCompleted
          ? 'Chore marked as completed'
          : 'Chore marked as incomplete'
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
