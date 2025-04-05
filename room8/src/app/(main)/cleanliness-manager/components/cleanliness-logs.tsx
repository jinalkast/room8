import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserGuideModal from '@/components/user-guide-modal';
import useRoommates from '@/hooks/useRoommates';
import { USER_GUIDE } from '@/lib/constants/user-guide';
import { useState } from 'react';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import { TCleanlinessTask } from '../types';
import TaskFilters from './task-filters';
import TaskList from './task-list';

export default function CleanlinessLogs() {
  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks();
  const { data: user } = useUser();
  const { data: roommates, isLoading: loadingRoommates } = useRoommates();

  const [filteredTasks, setFilteredTasks] = useState<TCleanlinessTask[]>([]);

  if (loadingTasks || !tasks || !user || loadingRoommates || !roommates) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cleanliness Tasks <UserGuideModal data={USER_GUIDE.CM_TASKS} />
        </CardTitle>
        <CardDescription>View the cleanliness Tasks for your house</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TaskFilters filteredTasks={filteredTasks} setFilteredTasks={setFilteredTasks} />
          <div className=" max-h-[65vh] overflow-y-auto">
            <TaskList tasks={filteredTasks} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
