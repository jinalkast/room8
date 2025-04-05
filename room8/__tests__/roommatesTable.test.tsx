import useRemoveRoommate from '@/app/(main)/house-settings/hooks/useRemoveRoomate';
import QueryProvider from '@/components/query-provider';
import RoommatesTable from '@/components/roommates-table';
import useGetHouse from '@/hooks/useGetHouse';
import useRoommates from '@/hooks/useRoommates';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/hooks/useRoommates', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/hooks/useGetHouse', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/app/(main)/house-settings/hooks/useRemoveRoomate', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('next/image', () => () => <img alt="roommate profile" />);

describe('RoommatesTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useRoommates as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useGetHouse as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useRemoveRoommate as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    render(<RoommatesTable />);

    expect(screen.getByRole('loading')).toBeTruthy();
  });

  it('renders empty state when no roommates exist', () => {
    (useRoommates as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useGetHouse as jest.Mock).mockReturnValue({
      data: { address: '123 Main St' },
      isLoading: false
    });

    render(
      <QueryProvider>
        <RoommatesTable />
      </QueryProvider>
    );

    expect(screen.getByText('No roommates found')).toBeTruthy();
  });

  it('renders roommates when data is available', () => {
    (useRoommates as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          imageUrl: '/john.jpg'
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '0987654321',
          imageUrl: '/jane.jpg'
        }
      ],
      isLoading: false
    });
    (useGetHouse as jest.Mock).mockReturnValue({
      data: { address: '123 Main St' },
      isLoading: false
    });
    (useRemoveRoommate as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    render(<RoommatesTable />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('jane@example.com')).toBeTruthy();
    expect(screen.getByText('1234567890')).toBeTruthy();
    expect(screen.getByText('Your roommates at 123 Main St')).toBeTruthy();
  });

  it('renders remove button when `remove` prop is true', () => {
    (useRoommates as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          imageUrl: '/john.jpg'
        }
      ],
      isLoading: false
    });
    (useGetHouse as jest.Mock).mockReturnValue({
      data: { address: '123 Main St' },
      isLoading: false
    });

    render(<RoommatesTable remove />);

    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('Opens remove modal when icon button is clicked', () => {
    const mockRemoveRoommate = jest.fn();
    (useRoommates as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          imageUrl: '/john.jpg'
        }
      ],
      isLoading: false
    });
    (useGetHouse as jest.Mock).mockReturnValue({
      data: { address: '123 Main St' },
      isLoading: false
    });
    (useRemoveRoommate as jest.Mock).mockReturnValue({ mutate: mockRemoveRoommate });

    render(<RoommatesTable remove />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Remove User')).toBeTruthy();
  });
});
