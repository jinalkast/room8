import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowUpDown, Check, Filter, User } from 'lucide-react';
import { TCleanlinessTask, TQuickFilter, TSortBy, TTaskStatus } from '../types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useUser from '@/app/auth/hooks/useUser';
import useRoommates from '@/hooks/useRoommates';
import LoadingSpinner from '@/components/loading';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import TaskMultiActions from './task-multi-actions';

type props = {
  filteredTasks: TCleanlinessTask[];
  setFilteredTasks: (tasks: TCleanlinessTask[]) => void;
  logId?: string;
  modal?: boolean;
};

function TaskFilters({ filteredTasks, setFilteredTasks, modal, logId }: props) {
  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks(logId);
  const { data: user } = useUser();
  const { data: roommates, isLoading: loadingRoommates } = useRoommates();

  const [statusFilters, setStatusFilters] = useState<TTaskStatus[]>([
    'unassigned',
    'pending',
    'completed',
    'dismissed'
  ]);
  const [assignedToId, setAssignedToId] = useState<string | 'anyone'>('anyone');
  const [sortBy, setSortBy] = useState<TSortBy>('Date (newest)');
  const [activeQuickFilter, setActiveQuickFilter] = useState<TQuickFilter | null>('all');

  if (loadingTasks || !tasks || !user || loadingRoommates || !roommates) {
    return <LoadingSpinner />;
  }

  const getSelectedRoommateName = () => {
    if (assignedToId === 'anyone') return 'Anyone';
    if (assignedToId === user.id) return 'Me';
    const roommate = roommates.find((r) => r.id === assignedToId);
    return roommate ? roommate.name : 'Anyone';
  };

  const toggleStatusFilter = (status: TTaskStatus) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const allStatusesSelected = statusFilters.length === 4;

  const getStatusDisplayText = () => {
    if (allStatusesSelected) return 'All';
    if (statusFilters.length === 0) return 'None';
    if (statusFilters.length === 1) return statusFilters[0];
    return `${statusFilters.length} selected`;
  };

  const applyQuickFilter = (filter: TQuickFilter) => {
    setActiveQuickFilter(filter);

    switch (filter) {
      case 'all':
        setStatusFilters(['unassigned', 'pending', 'completed', 'dismissed']);
        setAssignedToId('anyone');
        setSortBy('Date (newest)');
        break;
      case 'yours':
        setStatusFilters(['unassigned', 'pending', 'completed', 'dismissed']);
        setAssignedToId(user.id);
        setSortBy('Date (newest)');
        break;
      case 'pending':
        setStatusFilters(['unassigned', 'pending']);
        setAssignedToId('anyone');
        setSortBy('Status priority');
        break;
      case 'history':
        setStatusFilters(['completed', 'dismissed']);
        setAssignedToId('anyone');
        setSortBy('Date (newest)');
        break;
    }
  };

  useEffect(() => {
    const filteredAndSorted = () => {
      let filtered = [...tasks];

      if (!allStatusesSelected) {
        filtered = filtered.filter((task) => {
          return statusFilters.some((status) => task.status === status.toLowerCase());
        });
      }

      if (assignedToId !== 'anyone') {
        filtered = filtered.filter((task) => task.assigned_to_id === assignedToId);
      }

      filtered.sort((a, b) => {
        if (modal || sortBy === 'Status priority') {
          const priorityOrder = { unassigned: 1, pending: 2, completed: 3, dismissed: 4 };
          const statusA = a.status;
          const statusB = b.status;
          return (priorityOrder[statusA] || 999) - (priorityOrder[statusB] || 999);
        } else if (sortBy === 'Date (newest)') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === 'Date (oldest)') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return 0;
      });

      return filtered;
    };

    setFilteredTasks(filteredAndSorted());
  }, [tasks, statusFilters, assignedToId, sortBy]);

  return (
    <>
      {!modal && (
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeQuickFilter === 'all' ? 'default' : 'outline'}
            onClick={() => applyQuickFilter('all')}>
            All Tasks
          </Button>
          <Button
            variant={activeQuickFilter === 'yours' ? 'default' : 'outline'}
            onClick={() => applyQuickFilter('yours')}>
            Your Tasks
          </Button>
          <Button
            variant={activeQuickFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => applyQuickFilter('pending')}>
            Pending Tasks
          </Button>
          <Button
            variant={activeQuickFilter === 'history' ? 'default' : 'outline'}
            onClick={() => applyQuickFilter('history')}>
            Task History
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-center w-full">
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
                  setActiveQuickFilter(null);
                  setStatusFilters(
                    allStatusesSelected ? [] : ['unassigned', 'pending', 'completed', 'dismissed']
                  );
                }}>
                {allStatusesSelected ? 'Deselect All' : 'Select All'}
              </Button>
              {(['unassigned', 'pending', 'completed', 'dismissed'] as TTaskStatus[]).map(
                (status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    className="justify-between capitalize"
                    onClick={() => {
                      setActiveQuickFilter(null);
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
                  setActiveQuickFilter(null);
                  setAssignedToId('anyone');
                }}>
                Anyone
              </Button>
              <Button
                variant={assignedToId === user.id ? 'default' : 'ghost'}
                className="justify-start w-full"
                onClick={() => {
                  setActiveQuickFilter(null);
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
                      setActiveQuickFilter(null);
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

        {!modal && (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort by: {sortBy}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="flex flex-col gap-2">
                {(['Date (newest)', 'Date (oldest)', 'Status priority'] as TSortBy[]).map(
                  (option) => (
                    <Button
                      key={option}
                      variant={sortBy === option ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => {
                        setActiveQuickFilter(null);
                        setSortBy(option);
                      }}>
                      {option}
                    </Button>
                  )
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        <TaskMultiActions filteredTasks={filteredTasks} />
      </div>
    </>
  );
}

export default TaskFilters;
