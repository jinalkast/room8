import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signOut } from '../actions/auth';

export default function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const signout = async () => {
    queryClient.clear();

    await signOut();

    router.refresh();
  };

  return signout;
}
