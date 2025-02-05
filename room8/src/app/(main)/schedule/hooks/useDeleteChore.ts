import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchDeleteChore = async (choreID: any) => {
  const res = await fetch(`/api/schedule/${choreID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete chore');
  }

  return res.json();
};

export default function useDeleteChore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (choreID: any) => {
      return fetchDeleteChore(choreID);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Success!',
        description: 'Chore successfully deleted'
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
