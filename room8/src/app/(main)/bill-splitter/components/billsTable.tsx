import useBills from '@/app/(main)/bill-splitter/hooks/use-bills';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';

export default function BillsTable() {
  const { data: bills, status: billsStatus, refetch: refetchBills } = useBills();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async ({ debtId, isPaid }: { debtId: string; isPaid: boolean }) => {
      const res = await fetch(`/api/bills/owes/${debtId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paid: !isPaid })
      });
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Bill status updated'
      });
      refetchBills();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'We coud not update the bill status'
      });
    }
  });

  return (
    <Table>
      <TableCaption>What You&apos;re Owed.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Total Paid Back</TableHead>
          <TableHead>Total Owed</TableHead>
          <TableHead className="text-right"> </TableHead>
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
              <TableRow key={bill.bill_id}>
                <TableCell className="font-medium">{bill.bill_name}</TableCell>
                <TableCell>{bill.sum_paid_back.toFixed(2)}</TableCell>
                <TableCell>{bill.total_owed.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/bill-spliter/bill/${bill.bill_id}`}>view Bill details</Link>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
