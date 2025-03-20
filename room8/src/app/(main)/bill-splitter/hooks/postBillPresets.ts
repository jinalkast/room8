import { TApiResponse } from '@/lib/types';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { postBillPresetSchema } from '@/app/(main)/bill-splitter/types';
import z from 'zod';
import { Tables } from '@/lib/types/supabase';

const postBillPreset = async (preset: z.infer<typeof postBillPresetSchema>): Promise<Tables<'bill_presets'>> => {
  const validatedData = postBillPresetSchema.parse(preset);
  const res = await fetch(`/api/bills/presets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...validatedData,
      owes: Object.fromEntries(validatedData.owes)
    })
  });

  if (!res.ok) {
    throw new Error('Failed to post bill');
  }

  const json: TApiResponse<Tables<'bill_presets'>> = await res.json();
  return json.data!;
};

const usePostBillPreset = ({
  queryClient,
  onSuccessCallback,
  onErrorCallback
}: {
  queryClient: QueryClient;
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}) => {
  return useMutation({
    mutationKey: ['postBillPreset'],
    mutationFn: postBillPreset,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['billPresets'] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: onErrorCallback
  });
};

export default usePostBillPreset;
