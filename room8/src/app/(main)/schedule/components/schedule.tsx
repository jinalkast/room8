'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ScheduleItem from './schedule-item';
import useAllActivities from '../hooks/useGetAllActivities';
import useUser from '@/app/auth/hooks/useUser';
import useRoommates from '@/hooks/useRoommates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/loading';
import { User, Users } from 'lucide-react';
import CreateChoreModal from './create-chore-modal';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';

const ALL_USER_ID = '123';

export default function ScheduleViewer() {
  const [selectedUserID, setSelectedUserID] = useState<string>(ALL_USER_ID);
  const { data: activities, isLoading: activitiesLoading } = useAllActivities();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: roommates, isLoading: roommatesLoading } = useRoommates();

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
  thisWeek.setHours(0, 0, 0, 0);

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredActivities =
    selectedUserID === ALL_USER_ID
      ? activities
      : activities?.filter((activity) => activity.responsible.includes(selectedUserID));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Weekly Schedule <UserGuideModal data={USER_GUIDE.CS_CALENDAR} />
        </CardTitle>
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
                  if (selectedUserID !== user?.id) {
                    setSelectedUserID(user?.id || ALL_USER_ID);
                  } else {
                    setSelectedUserID(ALL_USER_ID);
                  }
                }}>
                {selectedUserID !== user?.id ? (
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
              <Select value={selectedUserID} onValueChange={(value) => setSelectedUserID(value)}>
                <SelectTrigger className="w-[180px] bg-macMaroon">
                  <SelectValue placeholder="Filter by roommate" />
                </SelectTrigger>
                <SelectContent>
                  {roommates?.map((roommate) => (
                    <SelectItem key={roommate.id} value={roommate.id} className="flex items-center">
                      {roommate.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={ALL_USER_ID} className="flex items-center">
                    All Roommates
                  </SelectItem>
                </SelectContent>
              </Select>
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
