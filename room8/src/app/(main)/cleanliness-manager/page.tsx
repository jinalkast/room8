'use client';

import LoadingSpinner from '@/components/loading';
import useGetHouse from '@/hooks/useGetHouse';
import CleanlinessLogs from './components/cleanliness-logs';
import CleanlinessPast from './components/cleanliness-past';
import CleanlinessRecent from './components/cleanliness-recent';
import CleanlinessStats from './components/cleanliness-stats';
import useCleanlinessLogs from './hooks/useCleanlinessLogs';

export default function CleanlinessManagerPage() {
  const { data: houseData, isLoading } = useGetHouse();
  const { data: cleanlinessLogs } = useCleanlinessLogs({
    params: { houseID: houseData?.id || 'placeholder_for_typescript' },
    enabled: houseData !== undefined
  });

  return (
    <div>
      <h2 className="text-4xl mb-8">Cleanliness Management System</h2>
      {isLoading && <LoadingSpinner />}
      {!houseData?.cameraId && !isLoading && (
        <p> Please set up the camera first to enable the Cleanliness Management System.</p>
      )}
      {houseData?.cameraId && !isLoading && (
        <div className="flex gap-6">
          <div className="basis-[40vw] flex flex-col">
            <CleanlinessStats />
            <CleanlinessRecent cleanlinessLog={cleanlinessLogs && cleanlinessLogs[0]} />
            <CleanlinessPast cleanlinessLogs={cleanlinessLogs} />
          </div>
          <div className="flex-1">
            <CleanlinessLogs />
          </div>
        </div>
      )}
    </div>
  );
}
