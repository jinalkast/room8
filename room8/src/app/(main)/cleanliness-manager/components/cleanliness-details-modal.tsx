import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ClipboardEdit,
  Filter,
  ArrowUpDown,
  User,
  Check,
  Zap,
  Send,
  ClipboardCheck,
  PinOff,
  X,
  Trash
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { DialogClose } from '@/components/ui/dialog';
import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import { TCleanlinessLog } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import CleanlinessImage from './cleanliness-image';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import TaskCard from './task-card';
import useCleanlinessLogs from '../hooks/useCleanlinessLogs';
import useGetHouse from '@/hooks/useGetHouse';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useRoommates from '@/hooks/useRoommates';
import { PopoverClose } from '@radix-ui/react-popover';
import useUpdateAllCleanlinessTasks from '../hooks/useUpdateAllCleanlinessTasks';
import useDeleteAllCleanlinessTasks from '../hooks/useDeleteAllCleanlinessTasks';

type props = {
  cleanlinessLogId: string;
  recent?: boolean;
  showDetails?: boolean;
};

type Status = 'Unassigned' | 'Pending' | 'Completed' | 'Dismissed';

function CleanlinessDetailsModal({ cleanlinessLogId, recent, showDetails }: props) {
  const { data: houseData } = useGetHouse();
  const { data: cleanlinessLogs } = useCleanlinessLogs({
    params: { houseID: houseData?.id || 'placeholder_for_typescript' },
    enabled: houseData !== undefined
  });
  const cleanlinessLog = cleanlinessLogs?.find((log) => log.id === cleanlinessLogId);
  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks(cleanlinessLog?.id);
  const { data: user } = useUser();
  const { data: roommates, isLoading: loadingRoommates } = useRoommates();

  const { mutate: updateTasks, isPending } = useUpdateAllCleanlinessTasks();
  const { mutate: deleteTasks, isPending: isDeleting } = useDeleteAllCleanlinessTasks();

  // State for filters
  const [statusFilters, setStatusFilters] = useState<Status[]>([
    'Unassigned',
    'Pending',
    'Completed',
    'Dismissed'
  ]);
  const [assignedToId, setAssignedToId] = useState<string | 'anyone'>('anyone');

  if (!cleanlinessLog || loadingTasks || !tasks || !user || loadingRoommates || !roommates) {
    return <LoadingSpinner />;
  }

  // Get the name of the currently selected roommate for display
  const getSelectedRoommateName = () => {
    if (assignedToId === 'anyone') return 'Anyone';
    if (assignedToId === user.id) return 'Me';
    const roommate = roommates.find((r) => r.id === assignedToId);
    return roommate ? roommate.name : 'Anyone';
  };

  // Toggle status in filter list
  const toggleStatusFilter = (status: Status) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Check if all statuses are selected
  const allStatusesSelected = statusFilters.length === 4;

  // Get status display text
  const getStatusDisplayText = () => {
    if (allStatusesSelected) return 'All';
    if (statusFilters.length === 0) return 'None';
    if (statusFilters.length === 1) return statusFilters[0];
    return `${statusFilters.length} selected`;
  };

  // Filter and sort tasks
  const filteredTasks = () => {
    let filtered = [...tasks];

    // Apply status filter
    if (!allStatusesSelected) {
      filtered = filtered.filter((task) => {
        return statusFilters.some((status) => task.status === status.toLowerCase());
      });
    }

    // Apply assigned filter
    if (assignedToId !== 'anyone') {
      filtered = filtered.filter((task) => task.assigned_to_id === assignedToId);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priorityOrder = { unassigned: 1, pending: 2, completed: 3, dismissed: 4 };
      const statusA = a.status;
      const statusB = b.status;
      return (priorityOrder[statusA] || 999) - (priorityOrder[statusB] || 999);
    });

    return filtered;
  };

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
          <div className="">
            <p className="mt-6 mb-2">Created Tasks</p>

            <div className="flex gap-2 mb-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status: {getStatusDisplayText()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        setStatusFilters(
                          allStatusesSelected
                            ? []
                            : ['Unassigned', 'Pending', 'Completed', 'Dismissed']
                        );
                      }}>
                      {allStatusesSelected ? 'Deselect All' : 'Select All'}
                    </Button>
                    {(['Unassigned', 'Pending', 'Completed', 'Dismissed'] as Status[]).map(
                      (status) => (
                        <Button
                          key={status}
                          variant="ghost"
                          className="justify-between"
                          onClick={() => {
                            toggleStatusFilter(status);
                          }}>
                          {status}
                          {statusFilters.includes(status) && <Check className="h-4 w-4" />}
                        </Button>
                      )
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="flex gap-2">
                    <User className="h-4 w-4" />
                    <span>Assigned to: {getSelectedRoommateName()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={assignedToId === 'anyone' ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => {
                        setAssignedToId('anyone');
                      }}>
                      Anyone
                    </Button>
                    <Button
                      variant={assignedToId === user.id ? 'default' : 'ghost'}
                      className="justify-start w-full"
                      onClick={() => {
                        setAssignedToId(user.id);
                      }}>
                      <Image
                        src={user.image_url}
                        alt={user.name}
                        className="w-6 h-6 rounded-full mr-2"
                        width={24}
                        height={24}
                      />
                      Me ({user.name})
                    </Button>
                    {roommates
                      .filter((r) => r.id !== user.id)
                      .map((roommate) => (
                        <Button
                          key={roommate.id}
                          variant={assignedToId === roommate.id ? 'default' : 'ghost'}
                          className="justify-start w-full"
                          onClick={() => {
                            setAssignedToId(roommate.id);
                          }}>
                          <Image
                            src={roommate.imageUrl}
                            alt={roommate.name}
                            className="w-6 h-6 rounded-full mr-2"
                            width={24}
                            height={24}
                          />
                          {roommate.name}
                        </Button>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>

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
                                    ids: filteredTasks().map((t) => t.id),
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
                            ids: filteredTasks().map((t) => t.id),
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
                            ids: filteredTasks().map((t) => t.id),
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
                            ids: filteredTasks().map((t) => t.id),
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
                            ids: filteredTasks().map((t) => t.id)
                          });
                        }}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete all
                      </Button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {tasks && tasks?.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks().map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {filteredTasks().length === 0 && (
                  <div className="flex flex-col items-center justify-center border rounded-lg p-4 h-[210px]">
                    <p className="text-muted-foreground">No tasks match the current filters</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border rounded-lg p-4">
                <p className="text-muted-foreground">No tasks detected</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CleanlinessDetailsModal;
