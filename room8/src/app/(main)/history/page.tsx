import HouseHistory from './components/house-history-table';

export default function SchedulePage() {
  return (
    <div>
      <h2 className="text-4xl mb-8 flex items-center justify-between">House History</h2>
      <div className="flex-1">
        <HouseHistory />
      </div>
    </div>
  );
}
