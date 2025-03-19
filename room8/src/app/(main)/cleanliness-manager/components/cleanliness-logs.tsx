import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, ChevronDown, Filter, SortAsc, User, Check } from 'lucide-react';
import TaskList from './task-list';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import LoadingSpinner from '@/components/loading';
import useUser from '@/app/auth/hooks/useUser';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import useRoommates from '@/hooks/useRoommates';
import Image from 'next/image';

type Status = 'Unassigned' | 'Pending' | 'Completed' | 'Dismissed';
type SortBy = 'Date (newest)' | 'Date (oldest)' | 'Status priority';
type QuickFilter = 'all' | 'yours' | 'pending' | 'history';

export default function CleanlinessLogs() {
  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks();
  const { data: user } = useUser();
  const { data: roommates, isLoading: loadingRoommates } = useRoommates();

  // State for filters
  const [statusFilters, setStatusFilters] = useState<Status[]>([
    'Unassigned',
    'Pending',
    'Completed',
    'Dismissed'
  ]);
  const [assignedToId, setAssignedToId] = useState<string | 'anyone'>('anyone');
  const [sortBy, setSortBy] = useState<SortBy>('Date (newest)');
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter | null>('all');

  if (loadingTasks || !tasks || !user || loadingRoommates || !roommates) {
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

  // Apply quick filters
  const applyQuickFilter = (filter: QuickFilter) => {
    setActiveQuickFilter(filter);

    switch (filter) {
      case 'all':
        setStatusFilters(['Unassigned', 'Pending', 'Completed', 'Dismissed']);
        setAssignedToId('anyone');
        setSortBy('Date (newest)');
        break;
      case 'yours':
        setStatusFilters(['Unassigned', 'Pending', 'Completed', 'Dismissed']);
        setAssignedToId(user.id);
        setSortBy('Date (newest)');
        break;
      case 'pending':
        setStatusFilters(['Unassigned', 'Pending']);
        setAssignedToId('anyone');
        setSortBy('Status priority');
        break;
      case 'history':
        setStatusFilters(['Completed', 'Dismissed']);
        setAssignedToId('anyone');
        setSortBy('Date (newest)');
        break;
    }
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
      if (sortBy === 'Date (newest)') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'Date (oldest)') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'Status priority') {
        // Define priority order: pending > unassigned > dismissed > completed
        const priorityOrder = { unassigned: 1, pending: 2, completed: 3, dismissed: 4 };
        const statusA = a.status;
        const statusB = b.status;
        return (priorityOrder[statusA] || 999) - (priorityOrder[statusB] || 999);
      }
      return 0;
    });

    return filtered;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cleanliness Tasks</CardTitle>
        <CardDescription>View the cleanliness Tasks for your house</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick filter buttons */}
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

          <div className="flex gap-2">
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

            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort by: {sortBy}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <div className="flex flex-col gap-2">
                  {(['Date (newest)', 'Date (oldest)', 'Status priority'] as SortBy[]).map(
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
          </div>

          <TaskList tasks={filteredTasks()} />
        </div>
      </CardContent>
    </Card>
  );
}
