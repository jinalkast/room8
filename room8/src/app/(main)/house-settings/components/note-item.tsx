import useRoommates from '@/hooks/useRoommates';
import { TNote } from '../types';
import { TRoommate } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, Trash } from 'lucide-react';
import LoadingSpinner from '@/components/loading';
import { useState } from 'react';
import useEditNote from '../hooks/useEditNote';
import { Modal } from '@/components/modal';
import { DialogClose } from '@/components/ui/dialog';
import useDeleteNote from '../hooks/useDeleteNote';
import useUser from '@/app/auth/hooks/useUser';

type props = {
  note: TNote;
};

function NoteItem({ note }: props) {
  const { data: roommates, isLoading: roommatesLoading } = useRoommates();
  const { data: user, isLoading: userLoading } = useUser();
  const [favourited, setFavourited] = useState(note.favourited);
  const { mutate: editNote } = useEditNote();
  const { mutate: deleteNote } = useDeleteNote();

  if (roommatesLoading) {
    return <LoadingSpinner />;
  }

  const getRoommateFromId = (id: string): TRoommate | undefined => {
    return roommates?.find((roommate) => roommate.id === id);
  };

  const formatDate = (date: string): string => {
    const newDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };

    if (newDate.getFullYear() !== new Date().getFullYear()) {
      options.year = 'numeric';
    }

    return newDate.toLocaleString('en-US', options);
  };

  const poster = getRoommateFromId(note.posterId);

  return (
    <div key={note.id} className="mb-4 border p-4 pb-2 rounded-md">
      <div className="flex gap-4 items-center">
        {poster ? (
          <>
            <Image
              src={poster.imageUrl}
              alt={poster.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-sm">{poster.name}</p>
          </>
        ) : (
          <p className="text-sm">Previous Roommate</p>
        )}
        <p className="text-sm ml-auto">{formatDate(note.createdAt)}</p>
      </div>
      <p className="text-sm mt-2">{note.text}</p>
      <div className="flex items-center justify-end">
        <Button
          size="icon"
          variant="ghost"
          className="p-1 !h-6 !w-6"
          onClick={() => {
            setFavourited((prev) => {
              editNote({ noteId: note.id, favourited: !prev });
              return !prev;
            });
          }}>
          <Star
            className="!h-4 !w-4"
            fill={favourited ? '#FDBF57' : 'none'}
            stroke={favourited ? '#FDBF57' : 'currentColor'}
          />
        </Button>
        {user?.id === note.posterId && (
          <Modal
            title="Delete Note"
            trigger={
              <Button size="icon" variant="ghost" className="ml-2 p-1 !h-6 !w-6">
                <Trash className="!h-4 !w-4" />
              </Button>
            }
            description="Are you sure you want to delete this note?">
            <div className="flex gap-2">
              <DialogClose asChild className="w-full">
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteNote(note.id);
                  }}>
                  Delete Note
                </Button>
              </DialogClose>
              <DialogClose asChild className="w-full">
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default NoteItem;
