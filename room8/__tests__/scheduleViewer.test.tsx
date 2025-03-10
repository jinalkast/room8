import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduleViewer from '@/app/(main)/schedule/components/schedule';
import useAllActivities from '@/app/(main)/schedule/hooks/useGetAllActivities';
import useUser from '@/app/auth/hooks/useUser';
import QueryProvider from '@/components/query-provider';

// Mock the hooks
jest.mock('@/app/(main)/schedule/hooks/useGetAllActivities', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/app/auth/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock the CreateChoreModal component
jest.mock('@/app/(main)/schedule/components/create-chore-modal', () => () => (
  <button>Create Chore</button>
));

// Mock the ScheduleItem component to avoid loading issues
jest.mock('@/app/(main)/schedule/components/schedule-item', () => ({
  __esModule: true,
  default: ({ item }: { item: any }) => <div>{item.title}</div>
}));

describe('ScheduleViewer Component', () => {
  const mockActivities = [
    {
      id: '1',
      title: 'Clean Kitchen',
      description: 'Clean the kitchen counters',
      time: 'monday',
      responsible: ['user1'],
      complete: false
    },
    {
      id: '2',
      title: 'Take out Trash',
      description: 'Take out the trash',
      time: 'wednesday',
      responsible: ['user2'],
      complete: false
    }
  ];

  const mockUser = {
    id: 'user1',
    name: 'Test User'
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

  it('renders the schedule viewer with title and description', () => {
    render(
      <QueryProvider>
        <ScheduleViewer />
      </QueryProvider>
    );

    expect(screen.getByText('Weekly Schedule')).toBeInTheDocument();
    expect(
      screen.getByText('View your weekly schedule and add chores for you and your roommates.')
    ).toBeInTheDocument();
  });

  it('shows loading state when data is loading', () => {
    (useAllActivities as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(
      <QueryProvider>
        <ScheduleViewer />
      </QueryProvider>
    );

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('renders all days of the week', () => {
    render(
      <QueryProvider>
        <ScheduleViewer />
      </QueryProvider>
    );

    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('toggles between showing all activities and just user activities', () => {
    render(
      <QueryProvider>
        <ScheduleViewer />
      </QueryProvider>
    );

    // Initially shows all activities
    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Take out Trash')).toBeInTheDocument();

    // Click to show only my activities
    fireEvent.click(screen.getByText('Show Mine'));

    // Should only show user1's activities
    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
    expect(screen.queryByText('Take out Trash')).not.toBeInTheDocument();

    // Click to show all activities again
    fireEvent.click(screen.getByText('Show All'));

    // Should show all activities again
    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Take out Trash')).toBeInTheDocument();
  });

  it('renders the create chore button', () => {
    render(
      <QueryProvider>
        <ScheduleViewer />
      </QueryProvider>
    );

    expect(screen.getByText('Create Chore')).toBeInTheDocument();
  });

  it('handles empty activities list', () => {
    (useAllActivities as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    render(
      <QueryProvider>
        <ScheduleViewer />
      </QueryProvider>
    );

    expect(screen.queryByText('Clean Kitchen')).not.toBeInTheDocument();
    expect(screen.queryByText('Take out Trash')).not.toBeInTheDocument();
  });
});
