import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/(main)/profile/page';
import useUser from '@/app/auth/hooks/useUser';
import useEditProfile from '@/app/(main)/profile/hooks/useEditProfile';
import QueryProvider from '@/components/query-provider';

jest.mock('@/app/auth/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/app/(main)/profile/hooks/useEditProfile', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock(
  '@/components/mutate-loading',
  () =>
    ({ condition }: { condition: Boolean }) =>
      condition ? <div>Updating...</div> : null
);

describe('ProfilePage Component', () => {
  it('renders loading state', () => {
    (useUser as jest.Mock).mockReturnValue({ data: null, status: 'pending' });
    (useEditProfile as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(
      <QueryProvider>
        <ProfilePage />
      </QueryProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders error state', () => {
    (useUser as jest.Mock).mockReturnValue({ data: null, status: 'error' });

    render(<ProfilePage />);

    expect(screen.getByText('Error fetching user')).toBeTruthy();
  });

  it('renders user profile information', () => {
    (useUser as jest.Mock).mockReturnValue({
      data: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        image_url: '/profile.jpg',
        created_at: '2024-01-01T00:00:00Z'
      },
      status: 'success'
    });

    render(<ProfilePage />);

    expect(screen.getByText('My Profile')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
    expect(screen.getByText('Joined 2023-12-31')).toBeTruthy();
    expect(screen.getByText('123-456-7890')).toBeTruthy();
  });

  it('allows entering edit mode', async () => {
    (useUser as jest.Mock).mockReturnValue({
      data: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        image_url: '/profile.jpg',
        created_at: '2024-01-01T00:00:00Z'
      },
      status: 'success'
    });

    render(
        <QueryProvider>
            <ProfilePage />
        </QueryProvider>
);

    fireEvent.click(screen.getByText('Edit Profile'));

    expect(screen.getByLabelText('Name:')).toBeTruthy();
    expect(screen.getByLabelText('Phone Number:')).toBeTruthy();
    expect(screen.getByLabelText('Profile Picture:')).toBeTruthy();
  });

  it('triggers save changes', async () => {
    const mockMutate = jest.fn();
    (useUser as jest.Mock).mockReturnValue({
      data: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        image_url: '/profile.jpg',
        created_at: '2024-01-01T00:00:00Z'
      },
      status: 'success'
    });

    (useEditProfile as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

    render(<ProfilePage />);
    fireEvent.click(screen.getByText('Edit Profile'));

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1));
  });

  it('cancels edit mode', async () => {
    (useUser as jest.Mock).mockReturnValue({
      data: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        image_url: '/profile.jpg',
        created_at: '2024-01-01T00:00:00Z'
      },
      status: 'success'
    });

    render(<ProfilePage />);
    fireEvent.click(screen.getByText('Edit Profile'));

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByLabelText('Name:')).not.toBeTruthy();
  });

  it('shows updating state', async () => {
    (useUser as jest.Mock).mockReturnValue({
      data: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        image_url: '/profile.jpg',
        created_at: '2024-01-01T00:00:00Z'
      },
      status: 'success'
    });

    (useEditProfile as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });

    render(<ProfilePage />);
    expect(screen.getByText('Updating...')).toBeTruthy();
  });
});
