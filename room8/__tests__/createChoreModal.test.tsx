import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateChoreModal from '@/app/(main)/schedule/components/create-chore-modal';
import useCreateChore from '@/app/(main)/schedule/hooks/useCreateChore';
import useRoommates from '@/hooks/useRoommates';
import { daysOfWeek } from '@/lib/constants';

jest.mock('@/app/(main)/schedule/hooks/useCreateChore');
jest.mock('@/hooks/useRoommates');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('CreateChoreModal Component', () => {
  const mockRoommates = [
    { id: 'user1', name: 'John Doe', imageUrl: '/john.jpg' },
    { id: 'user2', name: 'Jane Smith', imageUrl: '/jane.jpg' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateChore as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useRoommates as jest.Mock).mockReturnValue({ data: mockRoommates, isLoading: false });
  });

  it('renders the modal trigger button with correct text', () => {
    render(<CreateChoreModal />);
    expect(screen.getByText('Add Chore')).toBeInTheDocument();
  });

  it('opens the modal when trigger button is clicked', () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));
    expect(screen.getByText('Add Chore', { selector: 'h2' })).toBeInTheDocument();
  });

  it('renders form fields with the correct labels', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    expect(screen.getByText('Chore Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Assign to')).toBeInTheDocument();
  });

  it('displays all days of the week for selection', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    daysOfWeek.forEach((day) => {
      const dayElements = screen.getAllByText(day[0].toUpperCase());
      expect(dayElements.length).toBeGreaterThan(0);
      expect(dayElements[0]).toBeInTheDocument();
    });
  });

  it('displays all roommates for assignment', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('allows input in all form fields', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    const choreNameInput = screen.getByLabelText('Chore Name');
    fireEvent.change(choreNameInput, { target: { value: 'Clean Kitchen' } });
    expect(choreNameInput).toHaveValue('Clean Kitchen');

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Wipe counters, sweep floor' } });
    expect(descriptionInput).toHaveValue('Wipe counters, sweep floor');
  });

  it('selects a day when clicked', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    const sundayElements = screen.getAllByText('S');
    const tuesdayElement = screen.getAllByText('T')[0];
    fireEvent.click(tuesdayElement);

    await waitFor(() => {
      expect(tuesdayElement.parentElement).toHaveClass('flex gap-2');
    });

    const sundayParentElements = sundayElements.map((el) => el.parentElement);
    const selectedSundayElement = sundayParentElements.find((el) =>
      el?.classList.contains('flex gap-2')
    );
    expect(selectedSundayElement).toBeUndefined();
  });

  it('selects roommates when clicked', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    fireEvent.click(screen.getByText('John Doe'));

    await waitFor(() => {
      const johnElement = screen.getByText('John Doe').parentElement;
      expect(johnElement).toHaveClass('bg-primary');
    });
  });

  it('submits the form with correct data when Create Chore button is clicked', async () => {
    const mockCreateChore = jest.fn();
    (useCreateChore as jest.Mock).mockReturnValue({ mutate: mockCreateChore, isPending: false });

    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    fireEvent.change(screen.getByLabelText('Chore Name'), { target: { value: 'Clean Kitchen' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Wipe counters' } });
    fireEvent.click(screen.getByText('John Doe'));
    fireEvent.click(screen.getAllByText('T')[0]);

    fireEvent.click(screen.getByText('Create Chore'));

    await waitFor(() => {
      expect(mockCreateChore).toHaveBeenCalledWith({
        responsible: ['user1'],
        date: 'tuesday',
        title: 'Clean Kitchen',
        description: 'Wipe counters'
      });
    });
  });

  it('resets form when Cancel button is clicked', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    fireEvent.change(screen.getByLabelText('Chore Name'), { target: { value: 'Clean Kitchen' } });

    fireEvent.click(screen.getByText('Cancel'));

    fireEvent.click(screen.getByText('Add Chore'));
    expect(screen.getByLabelText('Chore Name')).toHaveValue('');
  });

  it('shows validation errors when submitting invalid data', async () => {
    render(<CreateChoreModal />);
    fireEvent.click(screen.getByText('Add Chore'));

    fireEvent.click(screen.getByText('Create Chore'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Select at least one roommate')).toBeInTheDocument();
    });
  });

  it('shows loading indicator when roommates are loading', () => {
    (useRoommates as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(<CreateChoreModal />);

    fireEvent.click(screen.getByText('Add Chore'));
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
