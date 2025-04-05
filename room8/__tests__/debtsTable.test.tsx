import DebtsTable from '@/app/(main)/bill-splitter/components/debtsTable';
import useOwes from '@/app/(main)/bill-splitter/hooks/useOwes';
import QueryProvider from '@/components/query-provider';
import { TOwe } from '@/lib/types';
import { render, screen } from '@testing-library/react';

jest.mock('@/app/(main)/bill-splitter/hooks/useOwes');

const mockOwes: TOwe[] = [
  {
    owe_id: '1',
    bill_name: 'Groceries',
    loaner_name: 'Alice',
    owed_by: '2025-03-10',
    amount_owed: 50,
    paid: false,
    bill_id: '5e15721c-00ce-4026-bad6-a304c9aaf6b3',
    bill_total: 150,
    debtor_id: '123',
    debtor_name: 'Test',
    loaner_id: '356'
  },
  {
    owe_id: '2',
    bill_name: 'Electricity Bill',
    loaner_name: 'Bob',
    owed_by: '2025-03-15',
    amount_owed: 30,
    paid: false,
    bill_id: '5e15721c-00ce-4026-bad6-a304c9aaf6b3',
    bill_total: 150,
    debtor_id: '123',
    debtor_name: 'Test',
    loaner_id: '356'
  }
];

describe('DebtsTable Component', () => {
  it('renders debts correctly', () => {
    (useOwes as jest.Mock).mockReturnValue({
      data: mockOwes,
      status: 'success'
    });

    render(
      <QueryProvider>
        <DebtsTable />
      </QueryProvider>
    );

    expect(screen.getByText(/Name/i)).toBeTruthy();
    expect(screen.getByText(/Owed To/i)).toBeTruthy();
    expect(screen.getByText(/Deadline/i)).toBeTruthy();
    expect(screen.getByText(/Amount/i)).toBeTruthy();

    expect(screen.getByText(/Groceries/i)).toBeTruthy();
    expect(screen.getByText(/Alice/i)).toBeTruthy();
    expect(screen.getByText('$50')).toBeTruthy();

    expect(screen.getByText(/Electricity Bill/i)).toBeTruthy();
    expect(screen.getByText(/Bob/i)).toBeTruthy();
    expect(screen.getByText('$30')).toBeTruthy();
  });

  it('shows loading spinner when data is fetching', async () => {
    (useOwes as jest.Mock).mockReturnValue({
      data: undefined,
      status: 'pending'
    });

    render(
      <QueryProvider>
        <DebtsTable />
      </QueryProvider>
    );

    expect(screen.queryByRole('table')).toBeNull();
  });

  it('renders empty state if no debts exist', () => {
    (useOwes as jest.Mock).mockReturnValue({
      data: [],
      status: 'success'
    });

    render(
      <QueryProvider>
        <DebtsTable />
      </QueryProvider>
    );

    expect(screen.getByText(/Your outstanding debts/i)).toBeTruthy();
  });
});
