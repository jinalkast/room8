type props = {
  title: string;
  number?: string;
};

export default function SummaryCardStub({ title, number }: props) {
  return (
    <div className="flex-1 border rounded-md grid place-content-center text-center py-6">
      <h2 className="mb-2">{title}</h2>
      <h4 className="text-3xl font-semibold tracking-tight">${number}</h4>
    </div>
  );
}
