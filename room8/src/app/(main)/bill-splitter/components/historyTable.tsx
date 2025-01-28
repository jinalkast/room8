import useBillsHistory from '../hooks/useBillHistory';
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


export default function HistoryTable() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const { data: billsHistory, status: billsHistoryStatus, refetch: refetchBillsHistory } = useBillsHistory(pageNumber);

  return (
    <Table>
      <TableCaption>Your outstanding debts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Bill</TableHead>
          <TableHead>Debtor</TableHead>
          <TableHead>Loaner</TableHead>
          <TableHead>Paid at</TableHead>
          <TableHead className='text-right'>Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {billsHistoryStatus === 'pending' ? (
          <TableRow>
            <TableCell>Loading...</TableCell>
          </TableRow>
        ) : null}
        {billsHistoryStatus === 'error' ? (
          <TableRow>
            <TableCell>Failed to get debts</TableCell>
          </TableRow>
        ) : null}
        {billsHistoryStatus === 'success'
          ? billsHistory!.map((billHistory) => (
              <TableRow key={billHistory.owe_id}>
                <TableCell className="font-medium">{billHistory.bill_name}</TableCell>
                <TableCell>{billHistory.debtor}</TableCell>
                <TableCell>{billHistory.loaner}</TableCell>
                <TableCell>{billHistory.date_paid}</TableCell>
                <TableCell className='text-right'>{billHistory.amount_paid}</TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
