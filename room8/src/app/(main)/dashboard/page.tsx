'use client';

import useSignOut from '@/app/auth/hooks/useSignOut';
import useUser from '@/app/auth/hooks/useUser';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function DashboardPage() {
  const [open, setOpen] = useState<boolean>(false);

  const { data: user, isLoading: userLoading } = useUser();
  const signout = useSignOut();

  return (
    user && (
      <div className="">
        <h2 className="text-4xl mb-8">Hello, {user.name}</h2>

        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[400px] w-[800px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[600px]" />
            <Skeleton className="h-4 w-[400px]" />
            <Skeleton className="h-4 w-[400px]" />
            <Skeleton className="h-4 w-[400px]" />
          </div>
          <div className="flex gap-4 w-[800px]">
            <Skeleton className="h-[300px] flex-1 rounded-xl" />
            <Skeleton className="h-[300px] flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    )
  );
}
