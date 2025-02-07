'use client';

import { Modal } from '@/components/modal';
import { CheckCircle, Circle, CircleCheck } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useDeleteChore from '../hooks/useDeleteChore';
import useRoommates from '@/hooks/useRoommates';
import { TActivity } from '../types';
import LoadingSpinner from '@/components/loading';
import { Switch } from '@/components/ui/switch';
import useCompletedChores from '../hooks/useGetCompletedChores';
import { cn } from '@/lib/utils';
import useUpdateCompletedChore from '../hooks/useUpdateCompletedChore';
import MutateLoadingSpinner from '@/components/mutate-loading';

type props = {
  item: TActivity;
  thisWeek: Date;
  index: number;
};

export default function PendingItem({ item, thisWeek, index }: props) {
  const [open, setOpen] = useState(false);

  const { data: roommates, isLoading: roommatesLoading } = useRoommates();
  const { data: completedChores, isLoading: completedChoresLoading } = useCompletedChores(item.id);

  const { mutate: deleteChore, isPending: pendingDeleteChore } = useDeleteChore();
  const { mutate: updateChore, isPending: pendingUpdateChore } = useUpdateCompletedChore();

  const isRoommateCompleted = (roommateId: string) => {
    return completedChores?.some((chore) => {
      const choreDate = new Date(chore.created_at);
      return (
        chore.profile_id === roommateId &&
        choreDate >= thisWeek &&
        choreDate < new Date(thisWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });
  };

  const isChoreCompleted = () => {
    const thisWeekChores = completedChores?.filter((chore) => {
      const choreDate = new Date(chore.created_at);
      return (
        choreDate >= thisWeek && choreDate < new Date(thisWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });
    return thisWeekChores?.length === item.responsible.length;
  };

  if (isChoreCompleted() && index === 0) {
    return (
      <p className="text-muted-foreground p-4 block text-center">
        You have no more chores this week!
      </p>
    );
  }

  if (isChoreCompleted()) {
    return null;
  }

  const responsibleRoommates = roommates?.filter((roommate) =>
    item.responsible.includes(roommate.id)
  );

  if (roommatesLoading || !responsibleRoommates || completedChoresLoading) {
    return <LoadingSpinner />;
  }

  const CardStub = () => {
    return (
      <div className="rounded-lg px-4 py-4 border items-center cursor-pointer hover:bg-primary/10 transition">
        <div className="flex items-center justify-between">
          <div className="flex-shrink flex flex-col gap-2 basis-1/2">
            <p>
              <span className="font-bold text-macAccent">Name: </span>
              <span>{item.title}</span>
            </p>
            <p className="w-[400px]">
              <span className="font-bold text-macAccent">Description: </span> {item.description}
            </p>
            <p className="capitalize">
              <span className="font-bold text-macAccent">Time: </span> {item.time}
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {responsibleRoommates.map((roommate) => (
              <li key={roommate.id} className="flex items-center gap-2">
                <p className="flex-1 text-end">{roommate.name}</p>
                <Image
                  src={roommate.imageUrl}
                  alt={roommate.name}
                  className={cn(
                    'w-8 h-8 rounded-full ml-auto border-2 border-red-600',
                    isRoommateCompleted(roommate.id) && 'border-green-600'
                  )}
                  width={28}
                  height={28}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={'Chore Details'}
      trigger={
        <div>
          <CardStub />
        </div>
      }
      footer={
        <>
          <DialogClose asChild className="w-full">
            <Button
              variant="destructive"
              onClick={() => {
                deleteChore(item.id);
                setOpen(false);
              }}>
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild className="w-full">
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </>
      }>
      <div>
        <MutateLoadingSpinner condition={pendingUpdateChore || pendingDeleteChore} />
        <p className="mb-4">
          <span className="font-bold text-macAccent">Name: </span>
          <span>{item.title}</span>
        </p>
        {item.description && (
          <div>
            <p>
              <span className="font-bold text-macAccent">Description: </span> {item.description}
            </p>
          </div>
        )}

        {responsibleRoommates && responsibleRoommates.length > 0 && (
          <div className="mt-4">
            <p className="font-bold text-macAccent">Responsible</p>

            <ul className="flex flex-col gap-4 mt-4">
              {responsibleRoommates.map((roommate) => (
                <li key={roommate.id} className="flex items-center gap-2">
                  <Image
                    src={roommate.imageUrl}
                    alt={roommate.name}
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <p>{roommate.name}</p>

                  <p className="ml-auto">
                    {isRoommateCompleted(roommate.id) ? 'Completed' : 'Not Completed'}
                  </p>
                  <Switch
                    id="chore-completed"
                    checked={isRoommateCompleted(roommate.id) || false}
                    onCheckedChange={() => {
                      updateChore({
                        id: item.id,
                        userId: roommate.id,
                        isCompleted: !isRoommateCompleted(roommate.id)
                      });
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
