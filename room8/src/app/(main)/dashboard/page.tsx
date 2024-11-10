'use client';

import useSignOut from '@/app/auth/hooks/useSignOut';
import useUser from '@/app/auth/hooks/useUser';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';

export default function DashboardPage() {
  const [open, setOpen] = useState<boolean>(false);

  const { data: user, isLoading: userLoading } = useUser();
  const signout = useSignOut();

  return (
    user && (
      <div className="">
        <h2 className="text-4xl">Hello, {user.name}</h2>
        {/* <Button
        onClick={() => {
          signout();
        }}>
        Sign Out
      </Button> */}

        {/* <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add Entry"
        description="Add an entry for today"
        trigger={<Button variant={'default'}>button</Button>}
        footer={
          <DialogClose asChild>
            <Button variant="default">Complete Entry</Button>
          </DialogClose>
        }>
        hello world
      </Modal> */}
      </div>
    )
  );
}
