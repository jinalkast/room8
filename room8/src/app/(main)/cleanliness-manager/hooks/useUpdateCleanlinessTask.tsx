import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateCleanlinessTaskPayload {
  id: number;
  status: 'unassigned' | 'pending' | 'completed' | 'dismissed';
  assigned_to_id?: string;
  assigned_by_id?: string;
  completed_by_id?: string;
}

const fetchUpdateCleanlinessTask = async (payload: UpdateCleanlinessTaskPayload) => {
  const { id, ...updateData } = payload;
  const res = await fetch(`/api/cleanliness/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update cleanliness task');
  }

  return res.json();
};

export default function useUpdateCleanlinessTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCleanlinessTaskPayload) => {
      return fetchUpdateCleanlinessTask(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cleanliness-logs'] });
      queryClient.invalidateQueries({ queryKey: ['cleanliness-stats'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: `Task successfully ${variables.status}`
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
