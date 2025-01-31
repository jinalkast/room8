import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchCreateChore = async (chore: any) => {
  const res = await fetch(`/api/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chore)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to order habits');
  }

  return res.json();
};

export default function useCreateChore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chore: any) => {
      return fetchCreateChore(chore);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Success!',
        description: 'Chore successfully created'
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
