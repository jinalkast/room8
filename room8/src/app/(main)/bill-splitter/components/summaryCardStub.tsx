import { cn } from '@/lib/utils';

type props = {
  title: string;
  number?: string;
  colour: string;
};

export default function SummaryCardStub({ title, number, colour }: props) {
  return (
    <div className="flex-1 border rounded-md grid place-content-center text-center py-6">
      <h2 className="mb-2">{title}</h2>
      <h4 className={cn('text-3xl font-semibold tracking-tight', colour)}>${number}</h4>
    </div>
  );
}
