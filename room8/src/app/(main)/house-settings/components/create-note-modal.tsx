import { Modal } from '@/components/modal';
import { THouse } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';
import useCreateNote from '../hooks/useCreateNote';
import { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

type props = {};

function CreateNoteModal({}: props) {
  const [noteText, setNoteText] = useState('');
  const [favorite, setFavorite] = useState(false);
  const { mutate: createNote } = useCreateNote();

  return (
    <Modal
      title="Create Note"
      description="Create a note for your house"
      trigger={
        <Button>
          <Plus /> Create Note
        </Button>
      }
      footer={
        <>
          <DialogClose asChild className="w-full">
            <Button
              onClick={() => {
                createNote({ text: noteText, favourited: favorite });
                setNoteText('');
                setFavorite(false);
              }}>
              Post Note
            </Button>
          </DialogClose>
          <DialogClose asChild className="w-full">
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </>
      }>
      <div className="flex flex-col gap-4">
        <div>
          <Label>Note Text</Label>
          <Input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Note text..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Label>Favourited</Label>
          <Checkbox checked={favorite} onCheckedChange={() => setFavorite((prev) => !prev)} />
        </div>
      </div>
    </Modal>
  );
}

export default CreateNoteModal;
