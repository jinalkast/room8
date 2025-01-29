'use client';

import useGetHouse from '@/hooks/useGetHouse';
import HouseInfo from './components/house-info';
import CreateHouse from './components/create-house';
import LoadingSpinner from '@/components/loading';
import HouseInvites from './components/house-invites';

export default function HouseSettingsPage() {
  const { data: house, isLoading, isError } = useGetHouse();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-4xl mb-6">My House</h2>
      {house ? <HouseInfo house={house} /> : <CreateHouse />}
    </div>
  );
}
