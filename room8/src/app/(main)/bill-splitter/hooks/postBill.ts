import { TApiResponse, TBillDB } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { postBillSchema } from '@/app/(main)/bill-splitter/types';
import z from 'zod';

const postBill = async (billInfo: z.infer<typeof postBillSchema>): Promise<TBillDB> => {
  const validatedData = postBillSchema.parse(billInfo);
  const res = await fetch(`/api/bills`, {
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

  const json: TApiResponse<TBillDB> = await res.json();
  return json.data!;
};

const usePostBill = ({
  onSuccessCallback,
  onErrorCallback
}: {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}) => {
  return useMutation({
    mutationKey: ['postBill'],
    mutationFn: postBill,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback
  });
};

export default usePostBill;
