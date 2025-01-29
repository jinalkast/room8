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
  remove: boolean;
};

function RoommatesTable({ remove }: props) {
  const { data: roommates, isLoading, isError } = useRoommates();
  const { data: house, isLoading: houseLoading, isError: houseError } = useGetHouse();
  const { mutate: removeRoommate } = useRemoveRoommate();

  if (isLoading || houseLoading) return <LoadingSpinner />;

  return (
    <Table>
      <TableCaption>Your roommates at {house?.address}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          {remove && <TableHead>Remove</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {roommates ? (
          roommates.map((roommate: TRoommate) => (
            <TableRow key={roommate.id}>
              <TableCell className="flex gap-4 items-center">
                <Image
                  src={roommate.imageUrl}
                  alt={roommate.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {roommate.name}
              </TableCell>
              <TableCell>{roommate.email}</TableCell>
              <TableCell>{roommate.phone}</TableCell>
              {remove && (
                <TableCell>
                  <Modal
                    title="Confirm Remove"
                    description="Are you sure you want to remove this roommate?"
                    trigger={
                      <Button variant={'ghost'} size={'icon'} className="p-0">
                        <DoorOpen className="!h-6 !w-6" />
                      </Button>
                    }
                    footer={
                      <>
                        <DialogClose asChild className="w-full">
                          <Button variant="destructive" onClick={() => removeRoommate(roommate.id)}>
                            Remove User
                          </Button>
                        </DialogClose>
                        <DialogClose asChild className="w-full">
                          <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                      </>
                    }>
                    <div className="text-center mt-4 mb-2">
                      <p>{roommate.name}</p>
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
