import useUser from '@/app/auth/hooks/useUser';
import QueryProvider from '@/components/query-provider';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PendingChores from '../src/app/(main)/schedule/components/pending-chores';
import useAllActivities from '../src/app/(main)/schedule/hooks/useGetAllActivities';

jest.mock('../src/app/(main)/schedule/hooks/useGetAllActivities');
jest.mock('@/app/auth/hooks/useUser');
jest.mock('../src/app/(main)/schedule/components/pending-item', () => ({
  __esModule: true,
  default: ({ item, thisWeek, index }: any) => (
    <div data-testid={`pending-item-${index}`}>
      {item.title} - {thisWeek.toDateString()}
    </div>
  )
}));

describe('PendingChores Component', () => {
  const mockActivities = [
    {
      id: 1,
      title: 'Clean Kitchen',
      description: 'Clean the kitchen thoroughly',
      responsible: ['user123', 'user456'],
      time: 'monday',
      createdAt: new Date().toISOString(),
      houseId: 'house1'
    },
    {
      id: 2,
      title: 'Take out trash',
      description: 'Empty all trash cans',
      responsible: ['user123'],
      time: 'wednesday',
      createdAt: new Date().toISOString(),
      houseId: 'house1'
    },
    {
      id: 3,
      title: 'Clean bathroom',
      description: 'Clean the bathroom',
      responsible: ['user456'],
      time: 'friday',
      createdAt: new Date().toISOString(),
      houseId: 'house1'
    }
  ];

  const mockUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    (useAllActivities as jest.Mock).mockReturnValue({
      data: mockActivities,
      isLoading: false
    });

    (useUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false
    });
  });

  it('renders the component title and description', () => {
    render(
      <QueryProvider>
        <PendingChores />
      </QueryProvider>
    );

    expect(screen.getByText('Pending Chores')).toBeInTheDocument();
    expect(
      screen.getByText('View your pending chores and mark them as complete.')
    ).toBeInTheDocument();
  });

  it('shows loading state when activities are loading', () => {
    (useAllActivities as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(
      <QueryProvider>
        <PendingChores />
      </QueryProvider>
    );

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('shows loading state when user data is loading', () => {
    (useUser as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(
      <QueryProvider>
        <PendingChores />
      </QueryProvider>
    );

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('filters activities to show only those assigned to the current user', () => {
    render(
      <QueryProvider>
        <PendingChores />
      </QueryProvider>
    );

    expect(screen.getByTestId('pending-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('pending-item-1')).toBeInTheDocument();
    expect(screen.queryByText('Clean bathroom')).not.toBeInTheDocument();
  });

  it('sorts activities by day of the week', () => {
    render(
      <QueryProvider>
        <PendingChores />
      </QueryProvider>
    );

    const items = screen.getAllByTestId(/pending-item-\d+/);
    expect(items[0].textContent).toContain('Clean Kitchen');
    expect(items[1].textContent).toContain('Take out trash');
  });

  it('handles empty activities array', () => {
    (useAllActivities as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    render(
      <QueryProvider>
        <PendingChores />
      </QueryProvider>
    );

    expect(screen.queryByTestId(/pending-item-\d+/)).not.toBeInTheDocument();
  });
});
