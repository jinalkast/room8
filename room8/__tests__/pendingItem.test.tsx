import useRoommates from '@/hooks/useRoommates';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PendingItem from '../src/app/(main)/schedule/components/pending-item';
import useDeleteChore from '../src/app/(main)/schedule/hooks/useDeleteChore';
import useCompletedChores from '../src/app/(main)/schedule/hooks/useGetCompletedChores';
import useUpdateCompletedChore from '../src/app/(main)/schedule/hooks/useUpdateCompletedChore';
import { TActivity } from '../src/app/(main)/schedule/types';

jest.mock('@/hooks/useRoommates');
jest.mock('../src/app/(main)/schedule/hooks/useGetCompletedChores');
jest.mock('../src/app/(main)/schedule/hooks/useDeleteChore');
jest.mock('../src/app/(main)/schedule/hooks/useUpdateCompletedChore');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('PendingItem Component', () => {
  const mockItem: TActivity = {
    id: 1,
    title: 'Clean Kitchen',
    description: 'Clean the kitchen thoroughly',
    responsible: ['user1', 'user2'],
    createdAt: new Date().toISOString(),
    time: 'monday',
    houseId: 'house1'
  };

  const mockRoommates = [
    { id: 'user1', name: 'John Doe', imageUrl: '/john.jpg' },
    { id: 'user2', name: 'Jane Smith', imageUrl: '/jane.jpg' }
  ];

  const mockCompletedChores = [
    { id: 'completed1', profile_id: 'user1', created_at: new Date().toISOString() }
  ];

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
  thisWeek.setHours(0, 0, 0, 0);

  beforeEach(() => {
    (useRoommates as jest.Mock).mockReturnValue({
      data: mockRoommates,
      isLoading: false
    });

    (useCompletedChores as jest.Mock).mockReturnValue({
      data: mockCompletedChores,
      isLoading: false
    });

    (useDeleteChore as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false
    });

    (useUpdateCompletedChore as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false
    });
  });

  it('renders the chore details correctly', () => {
    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Clean the kitchen thoroughly')).toBeInTheDocument();
    expect(screen.getByText('monday', { exact: false })).toBeInTheDocument();
  });

  it('displays the responsible roommates', () => {
    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('displays loading spinner when roommates data is loading', () => {
    (useRoommates as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);
    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('displays loading spinner when completed chores data is loading', () => {
    (useCompletedChores as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);
    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('opens the modal when chore item is clicked', async () => {
    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    fireEvent.click(screen.getByText('Clean Kitchen'));

    await waitFor(() => {
      expect(screen.getByText('Chore Details')).toBeInTheDocument();
    });
  });

  it('shows completed status correctly for roommates', async () => {
    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    fireEvent.click(screen.getByText('Clean Kitchen'));

    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Not Completed')).toBeInTheDocument();
    });
  });

  it('calls deleteChore when delete button is clicked', async () => {
    const mockDelete = jest.fn();
    (useDeleteChore as jest.Mock).mockReturnValue({
      mutate: mockDelete,
      isPending: false
    });

    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    fireEvent.click(screen.getByText('Clean Kitchen'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete'));
      expect(mockDelete).toHaveBeenCalledWith(1);
    });
  });

  it('calls updateChore when switch is toggled', async () => {
    const mockUpdate = jest.fn();
    (useUpdateCompletedChore as jest.Mock).mockReturnValue({
      mutate: mockUpdate,
      isPending: false
    });

    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    fireEvent.click(screen.getByText('Clean Kitchen'));

    await waitFor(() => {
      const switches = screen.getAllByRole('switch');
      fireEvent.click(switches[1]);

      expect(mockUpdate).toHaveBeenCalledWith({
        id: 1,
        userId: 'user2',
        isCompleted: true
      });
    });
  });

  it('returns null when all roommates have completed the chore', () => {
    const fullCompletedChores = [
      { id: 'completed1', profile_id: 'user1', created_at: new Date().toISOString() },
      { id: 'completed2', profile_id: 'user2', created_at: new Date().toISOString() }
    ];

    (useCompletedChores as jest.Mock).mockReturnValue({
      data: fullCompletedChores,
      isLoading: false
    });

    const { container } = render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows mutation loading spinner when update is in progress', async () => {
    (useUpdateCompletedChore as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true
    });

    render(<PendingItem item={mockItem} thisWeek={thisWeek} index={0} />);

    fireEvent.click(screen.getByText('Clean Kitchen'));

    await waitFor(() => {
      expect(screen.getByRole('loading')).toBeInTheDocument();
    });
  });
});
