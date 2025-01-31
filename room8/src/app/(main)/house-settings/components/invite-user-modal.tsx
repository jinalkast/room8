import { Modal } from '@/components/modal';
import { THouse } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import useInviteUser from '../hooks/useInviteUser';
import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';

type props = {
  house: THouse;
};

function InviteUserModal({ house }: props) {
  const [email, setEmail] = useState('');
  const { mutate: inviteUser } = useInviteUser();
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
