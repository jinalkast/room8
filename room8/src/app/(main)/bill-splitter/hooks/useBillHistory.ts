import { TAmountOwedDB, TApiResponse, TBill } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { TBillHistory } from '../types';

export const fetchBillsHistory = async (pageNumber: number): Promise<TBillHistory[]> => {
  const res = await fetch(
    '/api/bills/history?' + new URLSearchParams({ page: pageNumber.toString() }).toString(),
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json: TApiResponse<TAmountOwedDB[]> = await res.json();
  const data: TBillHistory[] = json.data!.map((amountOwed) => {
    return {
      owe_id: amountOwed.owe_id!,
      debtor_id: amountOwed.debtor_id!,
      debtor: amountOwed.debtor_name!,
      loaner: amountOwed.loaner_name!,
      amount_paid: amountOwed.amount_owed!,
      date_paid: amountOwed.updated_at!,
      bill_name: amountOwed.bill_name!
    };
  });
  return data ?? [];
};

export default function useBillsHistory(pageNumber: number) {
  return useQuery({
    queryKey: ['bills', 'history', pageNumber],
    queryFn: async () => fetchBillsHistory(pageNumber)
  });
}
