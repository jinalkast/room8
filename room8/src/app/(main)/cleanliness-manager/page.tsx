'use client';

import useCleanlinessLogs from './hooks/useCleanlinessLogs';
import useGetHouse from '@/hooks/useGetHouse';
import CleanlinessRecent from './components/cleanliness-recent';
import CleanlinessPast from './components/cleanliness-past';
import CleanlinessLogs from './components/cleanliness-logs';

export default function CleanlinessManagerPage() {
  const { data: houseData } = useGetHouse();
  const { data: cleanlinessLogs } = useCleanlinessLogs({
    params: { houseID: houseData?.id || 'placeholder_for_typescript' },
    enabled: houseData !== undefined
  });
  return (
    <div>
      <h2 className="text-4xl mb-8">Cleanliness Management System</h2>
      <div className="flex gap-6">
        <div className="basis-[40vw] flex flex-col">
          <CleanlinessRecent cleanlinessLog={cleanlinessLogs && cleanlinessLogs[0]} />
          <CleanlinessPast cleanlinessLogs={cleanlinessLogs} />
        </div>
        <div className="flex-1">
          <CleanlinessLogs />
        </div>
      </div>
    </div>
  );
}
