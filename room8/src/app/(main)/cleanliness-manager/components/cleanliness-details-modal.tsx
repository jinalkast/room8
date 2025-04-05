import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import useGetHouse from '@/hooks/useGetHouse';
import useRoommates from '@/hooks/useRoommates';
import { cn } from '@/lib/utils';
import { ArrowRight, ClipboardEdit } from 'lucide-react';
import { useState } from 'react';
import useCleanlinessLogs from '../hooks/useCleanlinessLogs';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import { TCleanlinessTask } from '../types';
import CleanlinessImage from './cleanliness-image';
import TaskFilters from './task-filters';
import TaskList from './task-list';

type props = {
  cleanlinessLogId: string;
  recent?: boolean;
  showDetails?: boolean;
};

function CleanlinessDetailsModal({ cleanlinessLogId, recent, showDetails }: props) {
  const { data: houseData } = useGetHouse();
  const { data: user } = useUser();
  const { data: roommates, isLoading: loadingRoommates } = useRoommates();
  const { data: cleanlinessLogs } = useCleanlinessLogs({
    params: { houseID: houseData?.id || 'placeholder_for_typescript' },
    enabled: houseData !== undefined
  });
  const cleanlinessLog = cleanlinessLogs?.find((log) => log.id === cleanlinessLogId);

  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks(cleanlinessLog?.id);

  const [filteredTasks, setFilteredTasks] = useState<TCleanlinessTask[]>([]);

  if (!cleanlinessLog) {
    return;
  }

  if (loadingTasks || !tasks || !user || loadingRoommates || !roommates) {
    return <LoadingSpinner />;
  }

  return (
    <Modal
      title="Details"
      className="min-w-fit"
      description={`See what changes were made to your shared space and assign cleanup tasks`}
      trigger={
        showDetails ? (
          <Button variant="ghost" className="w-full justify-start">
            <ClipboardEdit className="h-4 w-4 mr-2" />
            View Details
          </Button>
        ) : (
          <Button className={cn(recent ? 'w-full mt-4' : '')}>
            <ClipboardEdit /> View Details
          </Button>
        )
      }
      footer={
        <DialogClose asChild className="w-full">
          <Button>Close</Button>
        </DialogClose>
      }>
      {loadingTasks ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-[500px]">
          <div className="flex justify-center gap-4 items-center">
            <CleanlinessImage
              imageUrl={cleanlinessLog.before_image_url}
              size={200}
              title="Most Recent Before Image"
            />
            <ArrowRight className="w-12 h-12" />
            <CleanlinessImage
              imageUrl={cleanlinessLog.after_image_url}
              size={200}
              title="Most Recent After Image"
            />
          </div>
          <div>
            <p className="mt-6 mb-2">Created Tasks</p>

            <div className="flex gap-2 mb-4">
              <TaskFilters
                filteredTasks={filteredTasks}
                setFilteredTasks={setFilteredTasks}
                logId={cleanlinessLog.id}
                modal
              />
            </div>

            <TaskList tasks={filteredTasks} showLog={false} />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CleanlinessDetailsModal;
