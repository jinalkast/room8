import { TApiResponse, TBillDB } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';

const patchOwe = async ({
  oweID,
  isPaid
}: {
  oweID: string;
  isPaid: boolean;
}): Promise<TBillDB> => {
  const res = await fetch(`/api/bills/owes/${oweID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paid: !isPaid })
  });
  if (!res.ok) {
    throw new Error('Failed to patch owe');
  }
  const json: TApiResponse<TBillDB> = await res.json();
  return json.data!;
};

const usePatchOwe = ({
  onSuccessCallback,
  onErrorCallback
}: {
  onSuccessCallback?: () => void;
  onErrorCallback?: (error: Error) => void;
}) => {
  return useMutation({
    mutationKey: ['patchOwe'],
    mutationFn: patchOwe,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback
  });
};

export default usePatchOwe;
