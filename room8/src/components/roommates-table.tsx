import useRoommates from '@/hooks/useRoommates';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import LoadingSpinner from './loading';
import useGetHouse from '@/hooks/useGetHouse';
import { TRoommate } from '@/lib/types';
import Image from 'next/image';
import { DoorOpen } from 'lucide-react';
import { Modal } from './modal';
import { DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import useRemoveRoommate from '@/app/(main)/house-settings/hooks/useRemoveRoomate';

type props = {
  remove?: boolean;
  hideFooter?: boolean;
};

function RoommatesTable({ remove, hideFooter }: props) {
  const { data: roommates, isLoading, isError } = useRoommates();
  const { data: house, isLoading: houseLoading, isError: houseError } = useGetHouse();
  const { mutate: removeRoommate } = useRemoveRoommate();

  if (isLoading || houseLoading) return <LoadingSpinner />;

  return (
    <Table>
      {!hideFooter && <TableCaption>Your roommates at {house?.address}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          {remove && <TableHead className="text-right">Remove</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {(roommates && roommates.length > 0) ? (
          roommates.map((roommate: TRoommate) => (
            <TableRow key={roommate.id}>
              <TableCell className="flex gap-4 items-center">
                <Image
                  src={roommate.imageUrl}
                  alt={roommate.name}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                {roommate.name}
              </TableCell>
              <TableCell>{roommate.email}</TableCell>
              <TableCell>{roommate.phone}</TableCell>
              {remove && (
                <TableCell className="text-right">
                  <Modal
                    title="Confirm Remove"
                    description={`Are you sure you want to remove ${roommate.name}?`}
                    trigger={
                      <Button variant={'ghost'} size={'icon'} className="p-0">
                        <DoorOpen className="!h-6 !w-6" />
                      </Button>
                    }>
                    <div className="flex gap-2">
                      <DialogClose asChild className="w-full">
                        <Button variant="destructive" onClick={() => removeRoommate(roommate.id)}>
                          Remove User
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
          <p>No roommates found</p>
        )}
      </TableBody>
    </Table>
  );
}

export default RoommatesTable;
