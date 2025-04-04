import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TCameraBody } from '../types';

export const fetchPutCamera = async ({
  cameraId,
  houseId
}: {
  cameraId: string;
  houseId: string;
}) => {
  const res = await fetch(`/api/house/${houseId}/camera`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cameraId } as TCameraBody)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to edit house');
  }

  return res.json();
};

export default function useEditCamera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId, houseId }: { cameraId: string; houseId: string }) => {
      return fetchPutCamera({
        cameraId,
        houseId
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['house'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'camera edited successfully'
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
