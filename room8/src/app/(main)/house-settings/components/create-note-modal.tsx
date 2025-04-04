import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useCreateNote from '../hooks/useCreateNote';

type props = {};

function CreateNoteModal({}: props) {
  const [noteText, setNoteText] = useState('');
  const [favorite, setFavorite] = useState(false);
  const { mutate: createNote, isPending: createNotePending } = useCreateNote();

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
              disabled={createNotePending}
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
          <Label htmlFor="favourited">Favourited</Label>
          <Checkbox
            id="favourited"
            checked={favorite}
            onCheckedChange={() => setFavorite((prev) => !prev)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CreateNoteModal;
