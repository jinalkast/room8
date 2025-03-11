import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduleItem from '../src/app/(main)/schedule/components/schedule-item';
import useRoommates from '@/hooks/useRoommates';
import useCompletedChores from '../src/app/(main)/schedule/hooks/useGetCompletedChores';
import useDeleteChore from '../src/app/(main)/schedule/hooks/useDeleteChore';
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

describe('ScheduleItem Component', () => {
  const mockItem: TActivity = {
    id: 1,
    title: 'Clean Kitchen',
    description: 'Clean the kitchen thoroughly',
    responsible: ['user1', 'user2'],
    createdAt: new Date().toISOString(),
    time: new Date().toISOString(),
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

  it('renders the chore title correctly', () => {
    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);
    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
  });

  it('displays loading spinner when data is loading', () => {
    (useRoommates as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);
    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('shows the responsible roommates', () => {
    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('opens the modal when clicked', async () => {
    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);

    fireEvent.click(screen.getByText('Clean Kitchen'));

    await waitFor(() => {
      expect(screen.getByText('Chore Details')).toBeInTheDocument();
      expect(screen.getByText('Description:', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Clean the kitchen thoroughly')).toBeInTheDocument();
    });
  });

  it('shows completed status correctly for roommates', async () => {
    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);

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

    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);

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

    render(<ScheduleItem item={mockItem} thisWeek={thisWeek} />);

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
});
