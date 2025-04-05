'use client';

import LoadingSpinner from '@/components/loading';
import useGetHouse from '@/hooks/useGetHouse';
import CreateHouse from './components/create-house';
import HouseInfo from './components/house-info';

export default function HouseSettingsPage() {
  const { data: house, isLoading, isError } = useGetHouse();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-4xl mb-8">My House</h2>
      {house ? <HouseInfo house={house} /> : <CreateHouse />}
    </div>
  );
}
