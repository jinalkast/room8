import { TApiResponse } from '@/lib/types';
import { Tables } from '@/lib/types/supabase';
import { QueryClient, useMutation } from '@tanstack/react-query';

const deleteBillPreset = async (billID: string): Promise<Tables<'bill_presets'>> => {
  const res = await fetch(`/api/bills/presets/${billID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Failed to post bill');
  }

  const json: TApiResponse<Tables<'bill_presets'>> = await res.json();
  return json.data!;
};

const useDeleteBillPreset = ({
  onSuccessCallback,
  onErrorCallback,
  queryClient,
}: {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
  queryClient: QueryClient
}) => {
  return useMutation({
    mutationKey: ['deleteBillPreset'],
    mutationFn: deleteBillPreset,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['billPresets'] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      if (onErrorCallback) {
        onErrorCallback();
      }
    }
  });
};

export default useDeleteBillPreset;
