import SummaryCard from '@/app/(main)/bill-splitter/components/summaryCard';
import useBills from '@/app/(main)/bill-splitter/hooks/useBills';
import useOwes from '@/app/(main)/bill-splitter/hooks/useOwes';
import QueryProvider from '@/components/query-provider';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@/app/(main)/bill-splitter/hooks/useBills');
jest.mock('@/app/(main)/bill-splitter/hooks/useOwes');

const mockLoans = [
  { bill_id: '1', bill_name: 'Groceries', sum_paid_back: 20, total_owed: 100 },
  { bill_id: '2', bill_name: 'Rent', sum_paid_back: 500, total_owed: 1500 }
];

const mockDebts = [
  {
    owe_id: '1',
    bill_id: '1',
    bill_name: 'Groceries',
    bill_total: 100,
    debtor_id: '123',
    debtor_name: 'Alice',
    loaner_id: '456',
    loaner_name: 'Bob',
    owed_by: '2025-03-15',
    amount_owed: 50,
    paid: false
  }
];

describe('SummaryCard Component', () => {
  it('renders the summary correctly', async () => {
    (useBills as jest.Mock).mockReturnValue({ data: mockLoans, isSuccess: true, isPending: false });
    (useOwes as jest.Mock).mockReturnValue({ data: mockDebts, isSuccess: true, isPending: false });

    render(
      <QueryProvider>
        <SummaryCard />
      </QueryProvider>
    );

    expect(screen.getByText(/Summary/i)).toBeTruthy();
    expect(screen.getByText(/See your current debts and loans/i)).toBeTruthy();

    expect(screen.getByText('$50.00')).toBeTruthy();
    expect(screen.getByText('$1080.00')).toBeTruthy();

    expect(screen.getByText(/Upcoming Debt Deadlines/i)).toBeTruthy();
    expect(screen.getByText(/Groceries/i)).toBeTruthy();
    expect(screen.getByText(/Due: 2025-03-15/i)).toBeTruthy();
    expect(screen.getByText(/To: Bob/i)).toBeTruthy();
    expect(screen.getByText('$50')).toBeTruthy();
  });

  it('shows loading state when data is fetching', () => {
    (useBills as jest.Mock).mockReturnValue({ data: undefined, isPending: true });
    (useOwes as jest.Mock).mockReturnValue({ data: undefined, isPending: true });

    render(
      <QueryProvider>
        <SummaryCard />
      </QueryProvider>
    );

    expect(screen.queryByText('Upcoming Debt Deadlines')).toBeNull();
  });

  it('shows empty state when no debts exist', async () => {
    (useBills as jest.Mock).mockReturnValue({ data: [], isSuccess: true, isPending: false });
    (useOwes as jest.Mock).mockReturnValue({ data: [], isSuccess: true, isPending: false });

    render(
      <QueryProvider>
        <SummaryCard />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/You have no current debts with deadlines/i)).toBeTruthy();
    });
  });
});
