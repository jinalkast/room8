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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { TOwe } from '@/lib/types';

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
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button>Hover To View Bill Details</Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <BillDetailsContent billId={bill.bill_id} />{' '}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
              </TableRow>
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

function BillDetailsContent({ billId }: { billId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['billDetails', billId],
    queryFn: () => fetchBillDetails(billId)
  });

  if (isLoading) return <div>Loading details...</div>;
  if (error) return <div>Failed to load details.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Debtor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data!.map((owe) => (
          <TableRow key={owe.owe_id}>
            <TableCell>{owe.debtor_name}</TableCell>
            <TableCell>{owe.amount_owed}</TableCell>
            <TableCell className="text-right">{owe.paid === true ? 'Paid' : 'Unpaid'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
