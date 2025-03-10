import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGetNotes from '../hooks/useGetNotes';
import CreateNoteModal from './create-note-modal';
import LoadingSpinner from '@/components/loading';
import NoteItem from './note-item';

function HouseNotes() {
  const { data: notes, isLoading: notesLoading } = useGetNotes();

  return (
    <Card className="basis-1/3 h-[85vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>House Notes</CardTitle>
        <CardDescription>See what your roommates are saying!</CardDescription>
      </CardHeader>

      {notesLoading ? (
        <LoadingSpinner />
      ) : (
        <CardContent>
          <div className="flex gap-4 mb-4">
            <CreateNoteModal />
          </div>
          {notes?.map((note) => <NoteItem key={note.id} note={note} />)}
        </CardContent>
      )}
    </Card>
  );
}

export default HouseNotes;
