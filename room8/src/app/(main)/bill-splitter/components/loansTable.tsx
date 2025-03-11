import useBills from '@/app/(main)/bill-splitter/hooks/useBills';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { TBill, TOwe } from '@/lib/types';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import usePatchOwe from '../hooks/patchOwe';
import LoadingSpinner from '@/components/loading';
import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function LoansTable() {
  const { data: bills, status: billsStatus, refetch: refetchBills } = useBills();
  const queryClient = useQueryClient();

  if (billsStatus === 'pending') {
    return <LoadingSpinner />;
  }

  return (
    <Table className="mt-4">
      <TableCaption>What your roommates owe you!</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Name</TableHead>
          <TableHead>Total Paid Back</TableHead>
          <TableHead>Total Owed</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills &&
          bills.map((bill: TBill) => (
            <TableRow key={bill.bill_id}>
              <TableCell>
                {bill.bill_name || <span className="text-muted-foreground">Untitled Debt</span>}
              </TableCell>
              <TableCell>${bill.sum_paid_back.toFixed(2)}</TableCell>
              <TableCell>${bill.total_owed.toFixed(2)}</TableCell>
              <Modal
                key={bill.bill_id}
                title={`Bill Details`}
                description={`${bill.bill_name && `Bill details for ${bill.bill_name}, `}total owed: $${bill.total_owed.toFixed(2)}, total paid back: $${bill.sum_paid_back.toFixed(2)}`}
                trigger={
                  <TableCell className="text-right">
                    <Button variant={'ghost'} size={'icon'} className="p-0">
                      <Info className="!h-6 !w-6" />
                    </Button>
                  </TableCell>
                }>
                <BillDetailsContent queryClient={queryClient} billId={bill.bill_id} />
              </Modal>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

async function fetchBillDetails(billId: string): Promise<TOwe[]> {
  const res = await fetch(`/api/bills/${billId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();
  return json.data;
}

export function BillDetailsContent({
  billId,
  queryClient
}: {
  billId: string;
  queryClient: QueryClient;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['billDetails', billId],
    queryFn: () => fetchBillDetails(billId)
  });
  const patchOweMutation = usePatchOwe({
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: ['billDetails', billId] });
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
    onErrorCallback: (error) => {
      console.log(error);
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Loaned To</TableHead>
          <TableHead>Amount</TableHead>

          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data!
          .sort((a, b) => a.debtor_name.localeCompare(b.debtor_name))
          .map((owe) => (
            <TableRow key={owe.owe_id}>
              <TableCell>{owe.debtor_name}</TableCell>
              <TableCell>${owe.amount_owed}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  {owe.paid ? (
                    <span className="text-green-500">Paid</span>
                  ) : (
                    <span className="text-red-500">Unpaid</span>
                  )}
                  <Switch
                    id="airplane-mode"
                    checked={owe.paid}
                    onCheckedChange={() => {
                      patchOweMutation.mutate({ oweID: owe.owe_id, isPaid: owe.paid });
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
