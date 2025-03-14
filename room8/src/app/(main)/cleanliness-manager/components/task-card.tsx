import { Button } from '@/components/ui/button';
import { TCleanlinessTask } from '../hooks/useGetCleanlinessTasks';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Info, Send, X } from 'lucide-react';
import useUpdateCleanlinessTask from '../hooks/useUpdateCleanlinessTask';
import useRoommates from '@/hooks/useRoommates';
import useUser from '@/app/auth/hooks/useUser';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LoadingSpinner from '@/components/loading';
import Image from 'next/image';
import { PopoverClose } from '@radix-ui/react-popover';
import CleanlinessDetailsModal from './cleanliness-details-modal';
import MutateLoadingSpinner from '@/components/mutate-loading';

type props = {
  task: TCleanlinessTask;
  showLog?: boolean;
};

function TaskCard({ task, showLog }: props) {
  const { mutate: updateTask, isPending } = useUpdateCleanlinessTask();

  const { data: roommates, isLoading: loadingRoommates } = useRoommates();
  const { data: user, isLoading: loadingUser } = useUser();

  if (loadingRoommates || loadingUser || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div key={task.id} className="p-2 border rounded-lg shadow-sm">
      <MutateLoadingSpinner condition={isPending} />
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={task.status}>{task.status}</Badge>
          <p className="capitalize">{task.name}</p>
        </div>

        <div className="flex gap-2">
          {showLog && <CleanlinessDetailsModal showDetails cleanlinessLogId={task.cl_log_id} />}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">
                <Send className="h-4 w-4" />
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
          <Button
            variant={'secondary'}
            onClick={() =>
              updateTask({
                id: task.id,
                status: 'completed',
                completed_by_id: user.id
              })
            }>
            <ClipboardCheck />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() =>
              updateTask({
                id: task.id,
                status: 'canceled'
              })
            }>
            <X />
          </Button>
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
