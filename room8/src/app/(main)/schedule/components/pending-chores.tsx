'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAllActivities from '../hooks/useGetAllActivities';
import useUser from '@/app/auth/hooks/useUser';
import LoadingSpinner from '@/components/loading';
import PendingItem from './pending-item';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';

export default function PendingChores() {
  const { data: activities, isLoading: activitiesLoading } = useAllActivities();
  const { data: user, isLoading: userLoading } = useUser();

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
  thisWeek.setHours(0, 0, 0, 0);

  const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const filteredActivities = activities
    ?.filter((activity) => activity.responsible.includes(user?.id))
    .sort((a, b) => {
      const dayA = daysOrder.indexOf(a.time);
      const dayB = daysOrder.indexOf(b.time);
      return dayA - dayB;
    });

  if (activitiesLoading || userLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Chores</CardTitle>
        <CardDescription>View your pending chores and mark them as complete.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {filteredActivities &&
            filteredActivities.map((activity, i) => (
              <PendingItem key={activity.id} index={i} thisWeek={thisWeek} item={activity} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
