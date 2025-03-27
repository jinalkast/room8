import { useMutation, useQueryClient } from '@tanstack/react-query';
import { THouseBody } from '../types';
import { toast } from '@/hooks/useToast';

export const fetchCreateHouse = async (house: THouseBody) => {
  const res = await fetch(`/api/house`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(house)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create house');
  }

  return res.json();
};

export default function useCreateHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (house: THouseBody) => {
      return fetchCreateHouse(house);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['house'] });
      queryClient.invalidateQueries({ queryKey: ['roommates'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'House created successfully'
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
