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
import { TOwe } from '@/lib/types';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import usePatchOwe from '../hooks/patchOwe';

export default function LoansTable() {
  const { data: bills, status: billsStatus, refetch: refetchBills } = useBills();
  const queryClient = useQueryClient();

  return (
    <Table>
      <TableCaption>What You&apos;re Owed.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Total Paid Back</TableHead>
          <TableHead className="text-right">Total Owed</TableHead>
          {/* <TableHead> </TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {billsStatus === 'pending' ? (
          <TableRow>
            <TableCell>Loading...</TableCell>
          </TableRow>
        ) : null}
        {billsStatus === 'error' ? (
          <TableRow>
            <TableCell>Failed to get bills</TableCell>
          </TableRow>
        ) : null}
        {billsStatus === 'success'
          ? bills?.map((bill) => (
              <Modal 
                key={bill.bill_id}
                title={`Details for bill - "${bill.bill_name}"`}
                trigger={
                  <TableRow >
                    <TableCell className="font-medium">{bill.bill_name}</TableCell>
                    <TableCell>{bill.sum_paid_back.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{bill.total_owed.toFixed(2)}</TableCell>
                  </TableRow>
                }>
                <BillDetailsContent queryClient={queryClient} billId={bill.bill_id} />
              </Modal>
            ))
          : null}
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

function BillDetailsContent({ billId, queryClient }: { billId: string, queryClient: QueryClient }) {
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

  if (isLoading) return <div>Loading details...</div>;
  if (error) return <div>Failed to load details.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Debtor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">{" "}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data!.map((owe) => (
          <TableRow key={owe.owe_id}>
            <TableCell>{owe.debtor_name}</TableCell>
            <TableCell>{owe.amount_owed}</TableCell>
            <TableCell>{owe.paid === true ? 'Paid' : 'Unpaid'}</TableCell>
            <TableCell className="text-right">
                  <Button
                    disabled={patchOweMutation.isPending}
                    onClick={(e) => {
                      patchOweMutation.mutate({ oweID: owe.owe_id, isPaid: owe.paid });
                    }}>
                    {owe.paid ? 'UnPay' : 'Pay Off'}
                  </Button>
                </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
