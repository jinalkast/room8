import LoadingSpinner from '@/components/loading';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import React from 'react';
import useBillsHistory from '../hooks/useBillHistory';

export default function HistoryTable() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const {
    data: billsHistory,
    status: billsHistoryStatus,
    refetch: refetchBillsHistory
  } = useBillsHistory(pageNumber);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (billsHistoryStatus === 'pending') {
    return <LoadingSpinner />;
  }

  return (
    <Table className="mt-4 max-sm:min-w-[800px]">
      <TableCaption>History of all debt payments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Loaned From</TableHead>
          <TableHead>Loaned To</TableHead>
          <TableHead>Paid On</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {billsHistory &&
          billsHistory.map((billHistory) => (
            <TableRow key={billHistory.owe_id}>
              <TableCell className="font-medium">
                {billHistory.bill_name || (
                  <span className="text-muted-foreground">Untitled Debt</span>
                )}
              </TableCell>
              <TableCell>{billHistory.loaner}</TableCell>
              <TableCell>{billHistory.debtor}</TableCell>
              <TableCell>{formatDate(billHistory.date_paid)}</TableCell>
              <TableCell className="text-right">${billHistory.amount_paid}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
