import { TBillPreset } from '@/app/(main)/bill-splitter/types';
import { Tables } from '@/lib/types/supabase';
import { useQuery } from '@tanstack/react-query';

export const fetchBillPresets = async (): Promise<TBillPreset[] | null> => {
  const res = await fetch(`/api/bills/presets`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Error fetching bills - Response was not ok');
  }

  const json = await res.json();
  const data = json.data as Tables<'bill_presets'>[];
  console.log('presetsFetched: ', data);

  const returnData = data.map((preset) => ({
    id: preset.id,
    name: preset.name,
    amount: preset.amount,
    owed_by: preset.owed_by !== null ? new Date(preset.owed_by) : undefined,
    owes: new Map(
      Object.entries(typeof preset.owes === 'string' ? JSON.parse(preset.owes) : preset.owes)
    )
  })) as TBillPreset[];

  console.log('returnData: ', returnData);

  return returnData; // Make sure this is reached
};

export default function useBillPresets() {
  return useQuery({
    queryKey: ['billPresets'],
    queryFn: async () => fetchBillPresets()
  });
}
