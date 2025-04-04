import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useRoommates from '@/hooks/useRoommates';
import { PopoverClose } from '@radix-ui/react-popover';
import { ClipboardCheck, PinOff, Send, Trash, X, Zap } from 'lucide-react';
import Image from 'next/image';
import useDeleteAllCleanlinessTasks from '../hooks/useDeleteAllCleanlinessTasks';
import useUpdateAllCleanlinessTasks from '../hooks/useUpdateAllCleanlinessTasks';
import { TCleanlinessTask } from '../types';

type props = {
  filteredTasks: TCleanlinessTask[];
};

function TaskMultiActions({ filteredTasks }: props) {
  const { data: user } = useUser();
  const { data: roommates } = useRoommates();

  if (!user || !roommates) return <LoadingSpinner />;

  const { mutate: updateTasks } = useUpdateAllCleanlinessTasks();
  const { mutate: deleteTasks } = useDeleteAllCleanlinessTasks();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="ml-auto mr-2" size={'icon'}>
          <Zap fill="white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2" align="end">
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Assign all to roommate
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2">
              <div className="flex flex-col gap-2">
                {roommates?.map((roommate) => (
                  <PopoverClose asChild key={roommate.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        updateTasks({
                          ids: filteredTasks.map((t) => t.id),
                          status: 'pending',
                          assigned_to_id: roommate.id,
                          assigned_by_id: user.id
                        });
                      }}>
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
              onClick={() => {
                updateTasks({
                  ids: filteredTasks.map((t) => t.id),
                  status: 'completed',
                  completed_by_id: user.id
                });
              }}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Mark all as completed
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                updateTasks({
                  ids: filteredTasks.map((t) => t.id),
                  status: 'unassigned'
                });
              }}>
              <PinOff className="h-4 w-4 mr-2" />
              Unassign all
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                updateTasks({
                  ids: filteredTasks.map((t) => t.id),
                  status: 'dismissed'
                });
              }}>
              <X className="h-4 w-4 mr-2" />
              Dismiss all
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                deleteTasks({
                  ids: filteredTasks.map((t) => t.id)
                });
              }}>
              <Trash className="h-4 w-4 mr-2" />
              Delete all
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TaskMultiActions;
