import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CleanlinessLogs from '@/app/(main)/cleanliness-manager/components/cleanliness-logs';
import useGetCleanlinessTasks from '@/app/(main)/cleanliness-manager/hooks/useGetCleanlinessTasks';
import useUser from '@/app/auth/hooks/useUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/app/(main)/cleanliness-manager/hooks/useGetCleanlinessTasks');
jest.mock('@/app/auth/hooks/useUser');

describe('CleanlinessLogs', () => {
  let queryClient: QueryClient;

  const mockTasks = [
    {
      id: 1,
      name: 'Clean kitchen',
      assigned_to_id: 'user1',
      assigned_by_id: 'user2',
      completed_by_id: null,
      cl_log_id: 'log1',
      status: 'pending',
      created_at: '2023-01-01T12:00:00Z'
    },
    {
      id: 2,
      name: 'Take out trash',
      assigned_to_id: null,
      assigned_by_id: 'user2',
      completed_by_id: null,
      cl_log_id: 'log1',
      status: 'unassigned',
      created_at: '2023-01-01T12:00:00Z'
    },
    {
      id: 3,
      name: 'Vacuum living room',
      assigned_to_id: 'user2',
      assigned_by_id: 'user1',
      completed_by_id: 'user2',
      cl_log_id: 'log1',
      status: 'completed',
      created_at: '2023-01-01T12:00:00Z'
    }
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
      isLoading: false,
      isSuccess: true
    });

    (useUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false
    });
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

    expect(screen.getByText('Yours')).toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Clean kitchen/i)).toBeInTheDocument();
    });
  });

  test('handles case when there are no tasks', () => {
    (useGetCleanlinessTasks as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    renderWithQueryClient(<CleanlinessLogs />);

    expect(screen.getByText('Yours')).toBeInTheDocument();
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
