import HistoryTable from '@/app/(main)/bill-splitter/components/historyTable';
import useBillsHistory from '@/app/(main)/bill-splitter/hooks/useBillHistory';
import { TBillHistory } from '@/app/(main)/bill-splitter/types';
import QueryProvider from '@/components/query-provider';
import { render, screen } from '@testing-library/react';

jest.mock('@/app/(main)/bill-splitter/hooks/useBillHistory');

const mockBillsHistory: TBillHistory[] = [
  {
    owe_id: '1',
    bill_name: 'Rent',
    loaner: 'Charlie',
    debtor: 'David',
    amount_paid: 500,
    date_paid: '2025-03-01',
    debtor_id: '2'
  },
  {
    owe_id: '2',
    bill_name: 'Internet Bill',
    loaner: 'Eve',
    debtor: 'Frank',
    amount_paid: 60,
    date_paid: '2025-03-05',
    debtor_id: '3'
  }
];

describe('HistoryTable Component', () => {
  it('renders bill history correctly', () => {
    (useBillsHistory as jest.Mock).mockReturnValue({
      data: mockBillsHistory,
      status: 'success'
    });

    render(
      <QueryProvider>
        <HistoryTable />
      </QueryProvider>
    );

    expect(screen.getByText(/Name/i)).toBeTruthy();
    expect(screen.getByText(/Loaned From/i)).toBeTruthy();
    expect(screen.getByText(/Loaned To/i)).toBeTruthy();
    expect(screen.getByText(/Paid On/i)).toBeTruthy();
    expect(screen.getByText(/Amount/i)).toBeTruthy();

    expect(screen.getByText(/Rent/i)).toBeTruthy();
    expect(screen.getByText(/Charlie/i)).toBeTruthy();
    expect(screen.getByText(/David/i)).toBeTruthy();
    expect(screen.getByText('$500')).toBeTruthy();

    expect(screen.getByText(/Internet Bill/i)).toBeTruthy();
    expect(screen.getByText(/Eve/i)).toBeTruthy();
    expect(screen.getByText(/Frank/i)).toBeTruthy();
    expect(screen.getByText('$60')).toBeTruthy();
  });

  it('shows loading spinner when data is fetching', async () => {
    (useBillsHistory as jest.Mock).mockReturnValue({
      data: undefined,
      status: 'pending'
    });

    render(
      <QueryProvider>
        <HistoryTable />
      </QueryProvider>
    );

    expect(screen.queryByRole('table')).toBeNull();
  });

  it('renders empty state if no bill history exists', () => {
    (useBillsHistory as jest.Mock).mockReturnValue({
      data: [],
      status: 'success'
    });

    render(
      <QueryProvider>
        <HistoryTable />
      </QueryProvider>
    );

    expect(screen.getByText(/History of all debt payments/i)).toBeTruthy();
  });
});
