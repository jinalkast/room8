import useUser from '@/app/auth/hooks/useUser';
import MutateLoadingSpinner from '@/components/mutate-loading';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useRoommates from '@/hooks/useRoommates';
import { PopoverClose } from '@radix-ui/react-popover';
import { ClipboardCheck, EllipsisVertical, PinOff, Send, Trash, X } from 'lucide-react';
import Image from 'next/image';
import useDeleteCleanlinessTask from '../hooks/useDeleteCleanlinessTask';
import useUpdateCleanlinessTask from '../hooks/useUpdateCleanlinessTask';
import { TCleanlinessTask } from '../types';
import CleanlinessDetailsModal from './cleanliness-details-modal';
import MatchExistingTaskModal from './match-existing-task-modal';

type props = {
  task: TCleanlinessTask;
  showLog?: boolean;
};

function TaskOptionsDropdown({ task, showLog }: props) {
  const { data: user } = useUser();
  const { data: roommates } = useRoommates();

  const { mutate: updateTask, isPending } = useUpdateCleanlinessTask();
  const { mutate: deleteTask } = useDeleteCleanlinessTask();

  if (!user) return;

  return (
    <Popover>
      <MutateLoadingSpinner condition={isPending} />
      <PopoverTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2" align="end">
        <div className="flex flex-col gap-2">
          {showLog && <CleanlinessDetailsModal showDetails cleanlinessLogId={task.cl_log_id} />}

          <MatchExistingTaskModal task={task} />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Assign to roommate
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2">
              <div className="flex flex-col gap-2">
                {roommates?.map((roommate) => (
                  <PopoverClose asChild key={roommate.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() =>
                        updateTask({
                          id: task.id,
                          status: 'pending',
                          assigned_to_id: roommate.id,
                          assigned_by_id: user.id
                        })
                      }>
                      <Image
                        src={roommate.imageUrl}
                        alt={roommate.name}
                        className="w-6 h-6 rounded-full mr-1"
                        width={24}
                        height={24}
                      />
                      {roommate.name}
                    </Button>
                  </PopoverClose>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <PopoverClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                updateTask({
                  id: task.id,
                  status: 'completed',
                  completed_by_id: user.id
                })
              }>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Mark as completed
            </Button>
          </PopoverClose>
          {task.status !== 'unassigned' && (
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  updateTask({
                    id: task.id,
                    status: 'unassigned'
                  })
                }>
                <PinOff className="h-4 w-4 mr-2" />
                Unassign
              </Button>
            </PopoverClose>
          )}
          {task.status !== 'dismissed' && (
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  updateTask({
                    id: task.id,
                    status: 'dismissed'
                  })
                }>
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
            </PopoverClose>
          )}
          {task.status === 'dismissed' && (
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => deleteTask(task.id)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </PopoverClose>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TaskOptionsDropdown;
