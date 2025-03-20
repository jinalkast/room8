import { Badge } from '@/components/ui/badge';
import { Crosshair } from 'lucide-react';

import useRoommates from '@/hooks/useRoommates';
import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import TaskOptionsDropdown from './task-options';
import { removeConfidenceInterval } from '../utils';
import { TCleanlinessTask } from '../types';

type props = {
  task: TCleanlinessTask;
  showLog?: boolean;
};

function TaskCard({ task, showLog }: props) {
  const { data: user, isLoading: loadingUser } = useUser();
  const { isLoading: loadingRoommates } = useRoommates();

  if (loadingRoommates || loadingUser || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div key={task.id} className="p-2 border rounded-lg shadow-sm">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={task.status}>{task.status}</Badge>
          <p className="capitalize flex items-center gap-2">
            {removeConfidenceInterval(task.name)[0]}
            {removeConfidenceInterval(task.name)[1] && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Crosshair size={16} /> {removeConfidenceInterval(task.name)[1]}
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <TaskOptionsDropdown task={task} showLog={showLog} />
        </div>
      </div>
      {task.assigned_to && (
        <p className="mt-2 text-muted-foreground text-sm">
          {task.assigned_to_id !== task.assigned_by_id ? (
            <>
              Assigned to <span className="text-macAccent">{task.assigned_to.name}</span> by{' '}
              <span className="text-macAccent">{task.assigned_by.name}</span>
            </>
          ) : (
            <>
              Assigned to <span className="text-macAccent">{task.assigned_to.name}</span>
            </>
          )}
        </p>
      )}
      {task.completed_by && (
        <p className="mt-2 text-muted-foreground text-sm">
          Completed by <span className="text-macAccent">{task.completed_by.name}</span>
        </p>
      )}
    </div>
  );
}

export default TaskCard;
