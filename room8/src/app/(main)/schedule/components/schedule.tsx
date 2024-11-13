'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { act, useState } from 'react';
import ScheduleItem from './schedule-item';
import { daysOfWeek } from '@/lib/constants';
import useAllActivities from '../../../../../hooks/useGetAllActivities';
import useUser from '@/app/auth/hooks/useUser';

export default function ScheduleViewer() {
  const [showAll, setShowAll] = useState(true);
  const { data: activities, isLoading } = useAllActivities();
  const { data: user, isLoading: userLoading } = useUser();

  const filteredActivities = showAll
    ? activities
    : activities?.filter((activity) => activity.responsible.includes(user?.id));

  console.log(activities);

  return (
    <div className="mt-8 border h-[400px] rounded-lg flex flex-col">
      <div className="flex p-4 border-b">
        <h3 className="text-2xl">Weekly Schedule</h3>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex gap-2 items-center ">
            <Label htmlFor="airplane-mode">Show All</Label>
            <Switch
              id="airplane-mode"
              checked={showAll}
              onCheckedChange={() => {
                setShowAll((prev) => !prev);
              }}
            />
          </div>
          <Button className="ml-auto">Add Chore</Button>
        </div>
      </div>

      <div className="p-4 flex-1">
        <div className="grid grid-cols-7 gap-4 h-full">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
            (day) => (
              <div key={day} className="p-2 rounded-lg h-full bg-muted">
                <h4 className="font-light tracking-[4px] text-center">{day}</h4>
                <div className="overflow-y-auto flex flex-col gap-2 mt-4">
                  {filteredActivities &&
                    filteredActivities
                      .filter((activity) => daysOfWeek[new Date(activity.time).getDay()] === day)
                      .map((activity) => <ScheduleItem key={activity.id} item={activity} />)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
