import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardEdit, Info, Plus } from 'lucide-react';
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

type props = {
  cleanlinessLogId: string;
  recent?: boolean;
  showDetails?: boolean;
};

const STATUS_PRIORITY = {
  unassigned: 0,
  pending: 1,
  completed: 2,
  dismissed: 3
};

function CleanlinessDetailsModal({ cleanlinessLogId, recent, showDetails }: props) {
  const { data: houseData } = useGetHouse();

  const { data: cleanlinessLogs } = useCleanlinessLogs({
    params: { houseID: houseData?.id || 'placeholder_for_typescript' },
    enabled: houseData !== undefined
  });

  const cleanlinessLog = cleanlinessLogs?.find((log) => log.id === cleanlinessLogId);

  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks(cleanlinessLog?.id);

  if (!cleanlinessLog) {
    return null;
  }

  return (
    <Modal
      title="Details"
      className="min-w-fit"
      description={`See what changes were made to your shared space and assign cleanup tasks`}
      trigger={
        showDetails ? (
          <Button variant={'secondary'}>
            <Info />
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
        <div>
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
          <div>
            <p className="mt-6 mb-2">Created Tasks</p>
            {tasks && tasks?.length > 0 ? (
              <div className="space-y-4">
                {tasks
                  ?.sort((a, b) => {
                    return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
                  })
                  .map((task) => <TaskCard key={task.id} task={task} />)}
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
