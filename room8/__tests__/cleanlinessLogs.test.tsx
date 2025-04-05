import CleanlinessLogs from '@/app/(main)/cleanliness-manager/components/cleanliness-logs';
import useGetCleanlinessTasks from '@/app/(main)/cleanliness-manager/hooks/useGetCleanlinessTasks';
import useUser from '@/app/auth/hooks/useUser';
import useRoommates from '@/hooks/useRoommates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@/app/(main)/cleanliness-manager/hooks/useGetCleanlinessTasks');
jest.mock('@/app/auth/hooks/useUser');
jest.mock('@/hooks/useRoommates');

describe('CleanlinessLogs', () => {
  let queryClient: QueryClient;

  const mockTasks = [
    {
      id: 110,
      name: 'car removed',
      assigned_to_id: null,
      assigned_by_id: null,
      completed_by_id: null,
      cl_log_id: '863f032c-20c1-446b-bb86-77ea885a7de5',
      status: 'canceled',
      created_at: '2025-02-07T17:10:42.887841+00:00',
      completed_at: null,
      cleanliness_log: {
        id: '863f032c-20c1-446b-bb86-77ea885a7de5',
        camera_id: '56525b19-fe19-433d-b231-fc08b8203d5a',
        created_at: '2025-02-07T17:10:42.414732+00:00',
        after_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/after-863f032c-20c1-446b-bb86-77ea885a7de5.png',
        before_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/before-863f032c-20c1-446b-bb86-77ea885a7de5.png'
      },
      assigned_by: null,
      assigned_to: null
    },
    {
      id: 111,
      name: 'Clean kitchen',
      assigned_to_id: 'user1',
      assigned_by_id: 'user2',
      completed_by_id: null,
      cl_log_id: '964f032c-20c1-446b-bb86-77ea885a7ef6',
      status: 'pending',
      created_at: '2025-02-08T12:15:30.887841+00:00',
      completed_at: null,
      cleanliness_log: {
        id: '964f032c-20c1-446b-bb86-77ea885a7ef6',
        camera_id: '56525b19-fe19-433d-b231-fc08b8203d5b',
        created_at: '2025-02-08T12:15:30.414732+00:00',
        after_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/after-964f032c-20c1-446b-bb86-77ea885a7ef6.png',
        before_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/before-964f032c-20c1-446b-bb86-77ea885a7ef6.png'
      },
      assigned_by: { id: 'user2', name: 'User 2' },
      assigned_to: { id: 'user1', name: 'User 1' },
      completed_by: null
    },
    {
      id: 112,
      name: 'Bathroom cleanup',
      assigned_to_id: null,
      assigned_by_id: null,
      completed_by_id: null,
      cl_log_id: '753f032c-20c1-446b-bb86-77ea885a7de8',
      status: 'unassigned',
      created_at: '2025-02-09T08:30:22.887841+00:00',
      completed_at: null,
      cleanliness_log: {
        id: '753f032c-20c1-446b-bb86-77ea885a7de8',
        camera_id: '56525b19-fe19-433d-b231-fc08b8203d5c',
        created_at: '2025-02-09T08:30:22.414732+00:00',
        after_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/after-753f032c-20c1-446b-bb86-77ea885a7de8.png',
        before_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/before-753f032c-20c1-446b-bb86-77ea885a7de8.png'
      },
      assigned_by: null,
      assigned_to: null,
      completed_by: null
    },
    {
      id: 113,
      name: 'Living room tidying',
      assigned_to_id: 'user3',
      assigned_by_id: 'user2',
      completed_by_id: 'user3',
      cl_log_id: '123f032c-20c1-446b-bb86-77ea885a7de9',
      status: 'completed',
      created_at: '2025-02-06T14:22:12.887841+00:00',
      completed_at: '2025-02-06T16:45:30.887841+00:00',
      cleanliness_log: {
        id: '123f032c-20c1-446b-bb86-77ea885a7de9',
        camera_id: '56525b19-fe19-433d-b231-fc08b8203d5d',
        created_at: '2025-02-06T14:22:12.414732+00:00',
        after_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/after-123f032c-20c1-446b-bb86-77ea885a7de9.png',
        before_image_url:
          'images/70401819-3869-4892-9966-dc944546ca78/before-123f032c-20c1-446b-bb86-77ea885a7de9.png'
      },
      assigned_by: { id: 'user2', name: 'User 2' },
      assigned_to: { id: 'user3', name: 'User 3' },
      completed_by: { id: 'user3', name: 'User 3' }
    }
  ];

  const mockRoommates = [
    { id: 'user1', name: 'John Doe', imageUrl: '/john.jpg' },
    { id: 'user2', name: 'Jane Smith', imageUrl: '/jane.jpg' }
  ];

  const mockUser = { id: 'user1', email: 'user1@example.com', name: 'User 1' };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    (useGetCleanlinessTasks as jest.Mock).mockReturnValue({
      data: mockTasks,
      isLoading: false
    });

    (useUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false
    });

    (useRoommates as jest.Mock).mockReturnValue({ data: mockRoommates, isLoading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
  };

  test('renders loading spinner when data is loading', () => {
    (useGetCleanlinessTasks as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    renderWithQueryClient(<CleanlinessLogs />);

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('renders tabs with correct content', async () => {
    renderWithQueryClient(<CleanlinessLogs />);

    expect(screen.getByText('Cleanliness Tasks')).toBeInTheDocument();
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task History')).toBeInTheDocument();

    expect(screen.getByText(/Clean kitchen/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });
  });

  test('handles case when there are no tasks', () => {
    (useGetCleanlinessTasks as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    renderWithQueryClient(<CleanlinessLogs />);

    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.queryByText('Clean kitchen')).not.toBeInTheDocument();
  });

  test('handles case when user is not available', () => {
    (useUser as jest.Mock).mockReturnValue({
      data: null
    });

    renderWithQueryClient(<CleanlinessLogs />);

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });
});
