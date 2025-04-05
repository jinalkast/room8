import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Link } from 'lucide-react';
import useDeleteCleanlinessTask from '../hooks/useDeleteCleanlinessTask';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import useUpdateCleanlinessTask from '../hooks/useUpdateCleanlinessTask';
import { TCleanlinessTask } from '../types';
import TaskList from './task-list';

type props = {
  task: TCleanlinessTask;
};

function MatchExistingTaskModal({ task }: props) {
  const { data: user } = useUser();
  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks();

  const { mutate: updateTask } = useUpdateCleanlinessTask();
  const { mutate: deleteTask } = useDeleteCleanlinessTask();

  if (loadingTasks || !tasks || !user) {
    return <LoadingSpinner />;
  }

  const uncompletedTasks = tasks.filter(
    (t) =>
      t.id !== task.id &&
      t.status !== 'completed' &&
      t.status !== 'dismissed' &&
      t.cl_log_id !== task.cl_log_id
  );

  const handleMatchTask = (matchedTask: TCleanlinessTask) => {
    updateTask({
      id: matchedTask.id,
      status: 'completed',
      completed_by_id: user.id
    });
    deleteTask(task.id);
  };

  return (
    <Modal
      title="Match Existing Task"
      className="min-w-fit"
      description={`If this task is cleanup of another task, match it and both will be completed!`}
      trigger={
        <Button variant="ghost" className="w-full justify-start">
          <Link className="h-4 w-4 mr-2" />
          Match to existing task
        </Button>
      }
      footer={
        <DialogClose asChild className="w-full">
          <Button>Close</Button>
        </DialogClose>
      }>
      <div className="min-h-[500px]">
        <TaskList tasks={uncompletedTasks} matchExistingTask handleMatchTask={handleMatchTask} />
      </div>
    </Modal>
  );
}

export default MatchExistingTaskModal;
