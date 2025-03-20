import ChoreHistory from '@/app/(main)/schedule/components/chore-history';
import PendingChores from '@/app/(main)/schedule/components/pending-chores';
import ScheduleViewer from '@/app/(main)/schedule/components/schedule';
import HouseHistory from './components/house-history-table';

export default function SchedulePage() {
  return (
    <div>
      <h2 className="text-4xl mb-8">House History</h2>
        <div className="flex-1">
          <HouseHistory />
      </div>
    </div>
  );
}
