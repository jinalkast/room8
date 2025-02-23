import { TCleanlinessTask } from '../hooks/useGetCleanlinessTasks';
import TaskCard from './task-card';

type props = {
  tasks: TCleanlinessTask[];
};

function TaskList({ tasks }: props) {
  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {tasks && tasks?.length > 0 ? (
        <div className="space-y-4">
          {tasks?.map((task) => <TaskCard showLog key={task.id} task={task} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border rounded-lg p-4">
          <p className="text-muted-foreground">No tasks</p>
        </div>
      )}
    </div>
  );
}

export default TaskList;
