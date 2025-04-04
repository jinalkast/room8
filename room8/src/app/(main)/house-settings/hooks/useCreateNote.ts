import { toast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TNoteBody } from '../types';

export const fetchCreateNote = async (note: TNoteBody) => {
  const res = await fetch(`/api/house/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create note');
  }

  return res.json();
};

export default function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: TNoteBody) => {
      return fetchCreateNote(note);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Note created successfully'
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
