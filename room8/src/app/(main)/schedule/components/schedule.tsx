'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { act, useState } from 'react';
import ScheduleItem from './schedule-item';
import { daysOfWeek } from '@/lib/constants';
import useAllActivities from '../hooks/useGetAllActivities';
import useUser from '@/app/auth/hooks/useUser';
import { Modal } from '@/components/modal';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useCreateChore from '../hooks/useCreateChore';
import useRoommates from '@/hooks/useRoommates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/loading';
import { Plus, User, Users } from 'lucide-react';
import CreateChoreModal from './create-chore-modal';

export default function ScheduleViewer() {
  const [showAll, setShowAll] = useState(true);
  const { data: activities, isLoading: activitiesLoading } = useAllActivities();
  const { data: user, isLoading: userLoading } = useUser();

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
  thisWeek.setHours(0, 0, 0, 0);

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredActivities = showAll
    ? activities
    : activities?.filter((activity) => activity.responsible.includes(user?.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>
          View your weekly schedule and add chores for you and your roommates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activitiesLoading || userLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <CreateChoreModal />
              <Button
                onClick={() => {
                  setShowAll((prev) => !prev);
                }}>
                {showAll ? (
                  <>
                    <User />
                    Show Mine
                  </>
                ) : (
                  <>
                    <Users />
                    Show All
                  </>
                )}
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                (day, i) => (
                  <div key={day} className="p-2 rounded-md border">
                    <p className="text-center text-sm">{day.slice(0, 3)}</p>
                    <h4 className="text-center text-lg font-semibold">
                      {formatDay(new Date(thisWeek.getTime() + i * 24 * 60 * 60 * 1000))}
                    </h4>
                    <div className="overflow-y-auto flex flex-col gap-2 mt-4">
                      {filteredActivities &&
                        filteredActivities
                          .filter((activity) => activity.time === day.toLowerCase())
                          .map((activity) => (
                            <ScheduleItem key={activity.id} thisWeek={thisWeek} item={activity} />
                          ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
