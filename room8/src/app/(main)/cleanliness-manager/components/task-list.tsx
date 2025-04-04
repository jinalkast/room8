import { cn } from '@/lib/utils';
import { TCleanlinessTask } from '../types';
import TaskCard from './task-card';

type props = {
  tasks: TCleanlinessTask[];
  showLog?: boolean;
  matchExistingTask?: boolean;
  handleMatchTask?: (task: TCleanlinessTask) => void;
};

function TaskList({ tasks, handleMatchTask, showLog = true, matchExistingTask = false }: props) {
  return (
    <div className="">
      {tasks && tasks?.length > 0 ? (
        <div className="space-y-4">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className={cn(
                matchExistingTask && 'cursor-pointer hover:bg-primary/20 transition-all rounded-lg'
              )}
              onClick={() => handleMatchTask && handleMatchTask(task)}>
              <TaskCard
                showLog={showLog}
                key={task.id}
                task={task}
                matchExistingTask={matchExistingTask}
              />
            </div>
          ))}
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
