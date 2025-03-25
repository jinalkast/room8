'use client';

import useUser from '@/app/auth/hooks/useUser';
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
        {user.house_id ? (
          <div className="flex gap-6">
            <div>
              <DashboardCards />
              <SummaryCard />
              <PendingChores />
            </div>
            <div>{house && <HouseNotes />}</div>
          </div>
        ) : (
          <div className="p-4 grid place-content-center border rounded-lg w-1/2">
            <p>
              You are currently not in any house, to get access to all the features of Room8, create
              or join a house.
            </p>
          </div>
        )}
      </div>
    )
  );
}
