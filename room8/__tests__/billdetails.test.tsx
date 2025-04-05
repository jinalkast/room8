import { BillDetailsContent } from '@/app/(main)/bill-splitter/components/loansTable';
import usePatchOwe from '@/app/(main)/bill-splitter/hooks/patchOwe';
import QueryProvider from '@/components/query-provider';
import { TOwe } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('@/app/(main)/bill-splitter/hooks/patchOwe');
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn()
}));

const mockBillDetails: TOwe[] = [
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
  },
  {
    owe_id: '2',
    bill_id: '1',
    bill_name: 'Groceries',
    bill_total: 100,
    debtor_id: '789',
    debtor_name: 'Charlie',
    loaner_id: '456',
    loaner_name: 'Bob',
    owed_by: '2025-03-15',
    amount_owed: 51,
    paid: true
  }
];

describe('BillDetailsContent Component', () => {
  it('renders bill details correctly', async () => {
    const mockQueryClient = {
      invalidateQueries: jest.fn()
    };
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockBillDetails })
      })
    ) as jest.Mock;

    render(
      <QueryProvider>
        <BillDetailsContent billId="1" queryClient={mockQueryClient as any} />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Loaned To/i)).toBeTruthy();
      expect(screen.getByText(/Amount/i)).toBeTruthy();
      expect(screen.getByText(/Status/i)).toBeTruthy();

      expect(screen.getByText(/Alice/i)).toBeTruthy();
      expect(screen.getByText('$50')).toBeTruthy();
      expect(screen.queryAllByText(/Unpaid/i)).toBeTruthy();

      expect(screen.getByText(/Charlie/i)).toBeTruthy();
      expect(screen.getByText('$51')).toBeTruthy();
      expect(screen.queryAllByText(/Paid/i)).toBeTruthy();
    });
  });

  it('shows loading spinner when fetching bill details', async () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock; // Keeps the fetch unresolved

    render(
      <QueryProvider>
        <BillDetailsContent billId="1" queryClient={useQueryClient() as any} />
      </QueryProvider>
    );

    expect(screen.queryByRole('table')).toBeNull();
  });

  it('toggles payment status when clicking switch', async () => {
    const mockQueryClient = {
      invalidateQueries: jest.fn()
    };
    const mockPatchOweMutation = { mutate: jest.fn() };

    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (usePatchOwe as jest.Mock).mockReturnValue(mockPatchOweMutation);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockBillDetails })
      })
    ) as jest.Mock;

    render(
      <QueryProvider>
        <BillDetailsContent billId="1" queryClient={mockQueryClient as any} />
      </QueryProvider>
    );

    await waitFor(() => screen.getByText(/Alice/i));

    const switchButton = screen.getAllByRole('switch')[0];
    fireEvent.click(switchButton);

    expect(mockPatchOweMutation.mutate).toHaveBeenCalledWith({
      oweID: '1',
      isPaid: false
    });
  });
});
