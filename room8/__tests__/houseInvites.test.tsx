import { render, screen, fireEvent } from '@testing-library/react';
import HouseInvites from '@/app/(main)/house-settings/components/house-invites';
import useGetInvites from '@/app/(main)/house-settings/hooks/useGetInvites';
import useAcceptInvite from '@/app/(main)/house-settings/hooks/useAcceptInvite';
import useDeclineInvite from '@/app/(main)/house-settings/hooks/useDeclineInvite';

jest.mock('@/app/(main)/house-settings/hooks/useGetInvites', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/(main)/house-settings/hooks/useAcceptInvite', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/(main)/house-settings/hooks/useDeclineInvite', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('HouseInvites Component', () => {
  const mockInvites = [
    {
      id: 'invite1',
      inviter: { name: 'John Doe', imageUrl: '/john.png' },
      house: { name: 'Sunset Villa', address: '123 Ocean Drive' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with title and description', () => {
    (useGetInvites as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useAcceptInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useDeclineInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<HouseInvites />);

    expect(screen.getByText('Pending Invites')).toBeTruthy();
    expect(
      screen.getByText('If you are sent an invite to join a house, it will appear here.')
    ).toBeTruthy();
  });

  it('shows a loading spinner while fetching invites', () => {
    (useGetInvites as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    render(<HouseInvites />);

    expect(screen.getByRole('loading')).toBeTruthy();
  });

  it('renders invites with correct details', () => {
    (useGetInvites as jest.Mock).mockReturnValue({ data: mockInvites, isLoading: false });
    (useAcceptInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useDeclineInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<HouseInvites />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Sunset Villa')).toBeTruthy();
    expect(screen.getByText('123 Ocean Drive')).toBeTruthy();
  });

  it('calls acceptInvite when clicking "Accept"', () => {
    const mockAcceptInvite = jest.fn();
    (useGetInvites as jest.Mock).mockReturnValue({ data: mockInvites, isLoading: false });
    (useAcceptInvite as jest.Mock).mockReturnValue({ mutate: mockAcceptInvite, isPending: false });
    (useDeclineInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<HouseInvites />);

    fireEvent.click(screen.getByText('Accept'));

    expect(mockAcceptInvite).toHaveBeenCalledWith('invite1');
  });

  it('calls declineInvite when clicking "Decline"', () => {
    const mockDeclineInvite = jest.fn();
    (useGetInvites as jest.Mock).mockReturnValue({ data: mockInvites, isLoading: false });
    (useAcceptInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useDeclineInvite as jest.Mock).mockReturnValue({ mutate: mockDeclineInvite, isPending: false });

    render(<HouseInvites />);

    fireEvent.click(screen.getByText('Decline'));

    expect(mockDeclineInvite).toHaveBeenCalledWith('invite1');
  });

  it('disables buttons while mutation is pending', () => {
    (useGetInvites as jest.Mock).mockReturnValue({ data: mockInvites, isLoading: false });
    (useAcceptInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });
    (useDeclineInvite as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });

    render(<HouseInvites />);

    expect(screen.getByText('Accept').contentEditable).toBeFalsy();
    expect(screen.getByText('Decline').contentEditable).toBeFalsy();
  });
});
