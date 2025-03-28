import ChoreHistory from '@/app/(main)/schedule/components/chore-history';
import PendingChores from '@/app/(main)/schedule/components/pending-chores';
import ScheduleViewer from '@/app/(main)/schedule/components/schedule';

export default function SchedulePage() {
  return (
    <div>
      <h2 className="text-4xl mb-8">House Schedule</h2>
      <ScheduleViewer />
      <div className="flex gap-6 mt-6">
        <div className="flex-1">
          <PendingChores />
        </div>
        <div className="flex-1">
          <ChoreHistory />
        </div>
      </div>
    </div>
  );
}
