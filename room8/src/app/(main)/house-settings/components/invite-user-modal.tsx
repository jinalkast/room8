import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useInviteUser from '../hooks/useInviteUser';
import { THouse } from '../types';

type props = {
  house: THouse;
};

function InviteUserModal({ house }: props) {
  const [email, setEmail] = useState('');
  const { mutate: inviteUser, isPending: inviteUserPending } = useInviteUser();
  const { data: user, isLoading } = useUser();

  if (!user) return <LoadingSpinner />;

  return (
    <Modal
      title="Invite Roommate"
      description={`Invite a roommate to ${house.address}`}
      trigger={
        <Button className="ml-4">
          <Plus /> Invite Roommate
        </Button>
      }
      footer={
        <>
          <DialogClose asChild className="w-full">
            <Button
              disabled={inviteUserPending}
              onClick={() => {
                inviteUser({ houseId: house.id, inviterId: user.id, userEmail: email });
                setEmail('');
              }}>
              Invite User
            </Button>
          </DialogClose>
          <DialogClose asChild className="w-full">
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </>
      }>
      <div>
        <p className="mb-2">Enter email of the user you would like to invite:</p>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </Modal>
  );
}

export default InviteUserModal;
