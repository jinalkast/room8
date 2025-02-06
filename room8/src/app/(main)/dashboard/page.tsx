'use client';

import useSignOut from '@/app/auth/hooks/useSignOut';
import useUser from '@/app/auth/hooks/useUser';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import SummaryCard from '../bill-splitter/components/summaryCard';
import PendingChores from '../schedule/components/pending-chores';
import HouseNotes from '../house-settings/components/house-notes';
import useGetHouse from '@/hooks/useGetHouse';
import DashboardCards from './components/dashboard-cards';

export default function DashboardPage() {
  const [open, setOpen] = useState<boolean>(false);

  const { data: user, isLoading: userLoading } = useUser();
  const { data: house, isLoading: houseLoading } = useGetHouse();

  return (
    user && (
      <div>
        <h2 className="text-4xl mb-8">Hello, {user.name}</h2>
        <div className="flex gap-6">
          <div>
            <DashboardCards />
            <SummaryCard />
            <PendingChores />
          </div>
          <div>{house && <HouseNotes house={house} />}</div>
        </div>
      </div>
    )
  );
}
