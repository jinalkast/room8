import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteAllCleanlinessTasksPayload {
  ids: number[];
}

const fetchDeleteAllCleanlinessTasks = async (payload: DeleteAllCleanlinessTasksPayload) => {
  const res = await fetch(`/api/cleanliness/tasks`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete all cleanliness tasks');
  }

  return res.json();
};

export default function useDeleteAllCleanlinessTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteAllCleanlinessTasksPayload) => {
      return fetchDeleteAllCleanlinessTasks(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleanliness-tasks'] });
      toast({
        title: 'Success!',
        description: 'All tasks deleted successfully'
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
