import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchEditNote = async ({
  noteId,
  favourited
}: {
  noteId: number;
  favourited: boolean;
}) => {
  const res = await fetch(`/api/house/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favourited })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to edit note');
  }

  return res.json();
};

export default function useEditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, favourited }: { noteId: number; favourited: boolean }) => {
      return fetchEditNote({
        noteId,
        favourited
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Success!',
        description: 'Note edited successfully'
      });
    },
    onError: (err) => {
      toast({
        title: 'Error!',
        description: err.message
      });
    }
  });
}
