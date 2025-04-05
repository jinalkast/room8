import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const fetchDeleteCleanlinessTask = async (taskId: number) => {
  const res = await fetch(`/api/cleanliness/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete cleanliness task');
  }

  return res.json();
};

export default function useDeleteCleanlinessTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => {
      return fetchDeleteCleanlinessTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleanliness-logs'] });
      queryClient.invalidateQueries({ queryKey: ['cleanliness-stats'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Task deleted successfully'
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
