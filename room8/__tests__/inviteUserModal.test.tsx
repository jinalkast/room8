import { render, screen, fireEvent } from '@testing-library/react';
import InviteUserModal from '@/app/(main)/house-settings/components/invite-user-modal';
import useInviteUser from '@/app/(main)/house-settings/hooks/useInviteUser';
import useUser from '@/app/auth/hooks/useUser';
import { THouse } from '@/app/(main)/house-settings/types';

jest.mock('@/app/(main)/house-settings/hooks/useInviteUser', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/app/auth/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('InviteUserModal Component', () => {
  const mockHouse: THouse = {
    id: 'house123',
    address: '123 Main St',
    owner: '123',
    name: 'Humble Abode',
    chatbotActive: false,
    cameraId: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when user data is fetching', () => {
    (useUser as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useInviteUser as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<InviteUserModal house={mockHouse} />);

    expect(screen.getByRole('loading')).toBeTruthy();
  });

  it('renders modal trigger with the correct button text', () => {
    (useUser as jest.Mock).mockReturnValue({ data: { id: 'user123' }, isLoading: false });
    (useInviteUser as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<InviteUserModal house={mockHouse} />);

    expect(screen.getByText('Invite Roommate')).toBeTruthy();
  });

  it('renders modal content on button click with the correct button text', () => {
    (useUser as jest.Mock).mockReturnValue({ data: { id: 'user123' }, isLoading: false });
    (useInviteUser as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<InviteUserModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Invite Roommate'));
    expect(screen.getByText('Invite User')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Invite a roommate to 123 Main St')).toBeTruthy();
  });

  it('calls inviteUser when invite button is clicked', () => {
    const mockInviteUser = jest.fn();
    (useUser as jest.Mock).mockReturnValue({ data: { id: 'user123' }, isLoading: false });
    (useInviteUser as jest.Mock).mockReturnValue({ mutate: mockInviteUser, isPending: false });

    render(<InviteUserModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Invite Roommate'));

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const inviteButton = screen.getByText('Invite User');
    fireEvent.click(inviteButton);

    expect(mockInviteUser).toHaveBeenCalledWith({
      houseId: 'house123',
      inviterId: 'user123',
      userEmail: 'test@example.com'
    });
  });

  it('disables invite button while invite is pending', () => {
    (useUser as jest.Mock).mockReturnValue({ data: { id: 'user123' }, isLoading: false });
    (useInviteUser as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });

    render(<InviteUserModal house={mockHouse} />);
    fireEvent.click(screen.getByText('Invite Roommate'));

    expect(screen.getByText('Invite User').isContentEditable).toBeFalsy();
  });
});
