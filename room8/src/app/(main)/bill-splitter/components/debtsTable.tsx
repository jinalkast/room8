import useOwes from '@/app/(main)/bill-splitter/hooks/useOwes';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import usePatchOwe from '../hooks/patchOwe';

export default function DebtsTable() {
  const { data: owes, status: owesStatus } = useOwes();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const patchOweMutation = usePatchOwe({
    onSuccessCallback: () => {
      toast({
        title: 'Success!',
        description: 'Bill status updated'
      });
      queryClient.invalidateQueries({ queryKey: ['owes'] });
      queryClient.invalidateQueries({ queryKey: ['bills', 'history'] });
    },
    onErrorCallback: () => {
      toast({
        title: 'Error',
        description: 'We could not update the bill status'
      });
    }
  });

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
                  <Button
                    disabled={patchOweMutation.isPending}
                    onClick={(e) => {
                      patchOweMutation.mutate({ oweID: owe.owe_id, isPaid: owe.paid });
                    }}>
                    {owe.paid ? 'UnPay' : 'Pay Off'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
