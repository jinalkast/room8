import { Button } from '@/components/ui/button';
import { TCleanlinessTask } from '../hooks/useGetCleanlinessTasks';
import { Badge } from '@/components/ui/badge';
import {
  CircleEllipsis,
  ClipboardCheck,
  Crosshair,
  EllipsisVertical,
  Info,
  Send,
  Target,
  X
} from 'lucide-react';
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

  const removeConfidenceInterval = (name: string) => {
    const confidence = name.match(/\(conf: ([0-9.]+)\)/);
    if (confidence) {
      const percentage = +confidence[1] * 100;
      return [name.replace(confidence[0], ''), percentage.toFixed(0) + '%'];
    }
    return [name, ''];
  };

  return (
    <div key={task.id} className="p-2 border rounded-lg shadow-sm">
      <MutateLoadingSpinner condition={isPending} />
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size={'icon'}>
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2" align="end">
              <div className="flex flex-col gap-2">
                {showLog && (
                  <CleanlinessDetailsModal showDetails cleanlinessLogId={task.cl_log_id} />
                )}

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
              </div>
            </PopoverContent>
          </Popover>
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
