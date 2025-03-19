import useRoommates from '@/hooks/useRoommates';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import LoadingSpinner from '@/components/loading';
import useGetHouse from '@/hooks/useGetHouse';
import { TRoommate } from '@/lib/types';
import Image from 'next/image';
import { DoorOpen } from 'lucide-react';
import { Modal } from '@/components/modal';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import usePendingInvites from '@/app/(main)/house-settings/hooks/usePendingInvites';
import { TPendingInvite } from '../types';
import useDeleteInvite from '../hooks/useDeleteInvite';

type props = {
  remove?: boolean;
  hideFooter?: boolean;
};

function PendingInvitesTable({ remove, hideFooter }: props) {
  const { data: roommates, isLoading, isError } = useRoommates();
  const { data: pendingInvites, isLoading: invitesLoading } = usePendingInvites();
 const { mutate: removeInvite, isPaused: isDeletePending } = useDeleteInvite();

  if (isLoading || invitesLoading) return <LoadingSpinner />;

  return (
    <Table>
      {!hideFooter && <TableCaption>Pending Invites</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Invited By</TableHead>
          {remove && <TableHead className="text-right">Remove</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingInvites && pendingInvites.length > 0 ? (
          pendingInvites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell className="flex gap-4 items-center">
                <Image
                  src={invite.invited_user.image_url}
                  alt={invite.invited_user.name}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                {invite.invited_user.name}
              </TableCell>
              <TableCell>{invite.invited_user.email}</TableCell>
              <TableCell>{roommates!.find((rm) => rm.id === invite.inviter_id)?.name}</TableCell>
              {remove && (
                <TableCell className="text-right">
                  <Modal
                    title="Confirm Remove"
                    description={`Are you sure you want to cancel the invite for ${invite.invited_user.name}?`}
                    trigger={
                      <Button variant={'ghost'} size={'icon'} className="p-0">
                        <DoorOpen className="!h-6 !w-6" />
                      </Button>
                    }>
                    <div className="flex gap-2">
                      <DialogClose asChild className="w-full">
                        <Button
                          variant="destructive"
                          disabled={isDeletePending}
                          onClick={() => {
                            removeInvite({inviteID: invite.id.toString()});
                          }}>
                          Cancel Invite
                        </Button>
                      </DialogClose>
                      <DialogClose asChild className="w-full">
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                    </div>
                  </Modal>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>No Pending Invites found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default PendingInvitesTable;
