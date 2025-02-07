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
import { useQueryClient } from '@tanstack/react-query';
import usePatchOwe from '../hooks/patchOwe';
import LoadingSpinner from '@/components/loading';
import { TOwe } from '@/lib/types';
import { ClipboardCheck } from 'lucide-react';

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

  if (owesStatus === 'pending') {
    return <LoadingSpinner />;
  }

  return (
    <Table className="mt-4">
      <TableCaption>Your outstanding debts to roommates, pay them off asap!</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owed To</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Pay Off</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {owes &&
          owes.map((owe: TOwe) => (
            <TableRow key={owe.owe_id}>
              <TableCell className="font-medium">
                {owe.bill_name || <span className="text-muted-foreground">Untitled Debt</span>}
              </TableCell>
              <TableCell>{owe.loaner_name}</TableCell>
              <TableCell>
                {owe.owed_by || <span className="text-muted-foreground">No Deadline</span>}
              </TableCell>
              <TableCell>${owe.amount_owed}</TableCell>
              <TableCell className="text-right">
                <Button
                  disabled={patchOweMutation.isPending}
                  variant={'ghost'}
                  size={'icon'}
                  className="p-0"
                  onClick={(e) => {
                    patchOweMutation.mutate({ oweID: owe.owe_id, isPaid: owe.paid });
                  }}>
                  <ClipboardCheck className="!h-6 !w-6" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
