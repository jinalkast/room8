import DashboardCards from '@/app/(main)/dashboard/components/dashboard-cards';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('DashboardCards Component', () => {
  let queryClient: QueryClient;

  const mockPush = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
  };

  it('renders all dashboard cards', () => {
    renderWithQueryClient(<DashboardCards />);

    const cardNames = ['Bill Splitter', 'Chore Schedule', 'ChatBot', 'My House', 'Settings'];

    cardNames.forEach((name) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('navigates to the correct page on click', () => {
    renderWithQueryClient(<DashboardCards />);

    const billSplitterCard = screen.getByText('Bill Splitter');
    fireEvent.click(billSplitterCard);

    expect(mockPush).toHaveBeenCalledWith('/bill-splitter');
  });
});
