import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { THouseBody } from '../types';

export const fetchEditHouse = async ({
  house,
  houseId
}: {
  house: THouseBody;
  houseId: string;
}) => {
  const res = await fetch(`/api/house/${houseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(house)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to edit house');
  }

  return res.json();
};

export default function useEditHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ house, houseId }: { house: THouseBody; houseId: string }) => {
      return fetchEditHouse({
        house,
        houseId
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['house'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'House edited successfully'
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
