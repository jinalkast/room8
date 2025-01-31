'use client';

import { Modal } from '@/components/modal';
import { TActivity, TRoommate } from '@/lib/types';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import useRoommates from '../../../../../hooks/useRoomates';
import Image from 'next/image';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useDeleteChore from '../../../../../hooks/useDeleteChore';

type props = {
  item: TActivity;
};

export default function ScheduleItem({ item }: props) {
  const [open, setOpen] = useState(false);
  const { data: roommates, isLoading: roommatesLoading } = useRoommates();

  const deleteChore = useDeleteChore();

  const responsibleRoommates = roommates?.filter((roommate) =>
    item.responsible.includes(roommate.id)
  );

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={item.title}
      trigger={
        <div className="flex rounded-lg px-2 py-2 bg-primary items-center cursor-pointer hover:bg-primary/90 transition">
          <p className="text-sm mr-2">{item.title}</p>
          <CheckCircle className="ml-auto" size={20} />
        </div>
      }
      footer={
        <DialogClose asChild>
          <Button
            variant="destructive"
            onClick={() => {
              deleteChore.mutate(item.id);
              setOpen(false);
            }}>
            Delete
          </Button>
        </DialogClose>
      }>
      <div className="py-4">
        {item.description && (
          <div>
            <p>
              <span className="font-semibold">Chore Description: </span> {item.description}
            </p>
          </div>
        )}

        {responsibleRoommates && responsibleRoommates.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Responsible:</p>

            <ul className="flex flex-col gap-2 mt-2">
              {responsibleRoommates.map((roommate) => (
                <li key={roommate.id} className="flex items-center gap-2">
                  <Image
                    src={roommate.image_url}
                    alt={roommate.name}
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <p>{roommate.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
