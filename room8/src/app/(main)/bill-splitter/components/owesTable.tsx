import useOwes from '@/hooks/use-owes';
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

export default function OwesTable() {
  const { data: owes, status: owesStatus } = useOwes();

  async function toggleOweStatus(debtId: string, isPaid: boolean) {
    const res = await fetch(`/api/bills/owes/${debtId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: !isPaid })
    });

    // if (res.ok) {
    //   alert('Debt status updated');
    // } else {
    //   alert('Failed to update debt status');
    // }
  }

  return (
    <Table>
      <TableCaption>Your outstanding debts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owed To</TableHead>
          <TableHead>Owed By</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right"> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {owesStatus === 'pending' ? (
          <TableRow>
            <TableCell>Loading...</TableCell>
          </TableRow>
        ) : null}
        {owesStatus === 'error' ? (
          <TableRow>
            <TableCell>Failed to get debts</TableCell>
          </TableRow>
        ) : null}
        {owesStatus === 'success'
          ? owes!.map((owe) => (
              <TableRow key={owe.owe_id}>
                <TableCell className="font-medium">{owe.bill_name}</TableCell>
                <TableCell>{owe.paid === true ? 'Paid' : 'Unpaid'}</TableCell>
                <TableCell>{owe.loaner_name}</TableCell>
                <TableCell>{owe.owed_by}</TableCell>
                <TableCell>{owe.amount_owed}</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => toggleOweStatus(owe.owe_id, owe.paid)}>Pay off</Button>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
