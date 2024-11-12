import useDebts from '@/hooks/use-debts';
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

export default function OutstandingDebtsTable() {
  const { data: debts, status: debtsStatus } = useDebts();
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
        {debtsStatus === 'pending' ? (
          <TableRow>
            <TableCell>Loading...</TableCell>
          </TableRow>
        ) : null}
        {debtsStatus === 'error' ? (
          <TableRow>
            <TableCell>Failed to get debts</TableCell>
          </TableRow>
        ) : null}
        {debtsStatus === 'success'
          ? debts!.map((debt) => (
              <TableRow key={debt.owe_id}>
                <TableCell className="font-medium">{debt.bill_name}</TableCell>
                <TableCell>{debt.paid === true ? 'Paid' : 'Unpaid'}</TableCell>
                <TableCell>{debt.loaner_name}</TableCell>
                <TableCell>{debt.owed_by}</TableCell>
                <TableCell>{debt.amount_owed}</TableCell>
                <TableCell className="text-right">
                  <Button>Pay off</Button>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
