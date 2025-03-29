import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const fetchDeleteNote = async (noteID: number) => {
  const res = await fetch(`/api/house/notes/${noteID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete note');
  }

  return res.json();
};

export default function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteID: number) => {
      return fetchDeleteNote(noteID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Note deleted successfully'
      });
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: err.message
      });
    }
  });
}
