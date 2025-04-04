import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateAllCleanlinessTasksPayload {
  ids: number[];
  status: 'unassigned' | 'pending' | 'completed' | 'dismissed';
  assigned_to_id?: string;
  assigned_by_id?: string;
  completed_by_id?: string;
}

const fetchUpdateAllCleanlinessTasks = async (payload: UpdateAllCleanlinessTasksPayload) => {
  const res = await fetch(`/api/cleanliness/tasks`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update cleanliness tasks');
  }

  return res.json();
};

export default function useUpdateAllCleanlinessTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAllCleanlinessTasksPayload) => {
      return fetchUpdateAllCleanlinessTasks(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cleanliness-logs'] });
      queryClient.invalidateQueries({ queryKey: ['cleanliness-stats'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: `Tasks successfully ${variables.status}`
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
