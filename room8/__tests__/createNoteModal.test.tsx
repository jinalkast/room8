import { render, screen, fireEvent } from '@testing-library/react';
import CreateNoteModal from '@/app/(main)/house-settings/components/create-note-modal';
import useCreateNote from '@/app/(main)/house-settings/hooks/useCreateNote';

jest.mock('@/app/(main)/house-settings/hooks/useCreateNote', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('CreateNoteModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render the modal trigger with the correct button text', () => {
    (useCreateNote as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    render(<CreateNoteModal />);
    expect(screen.getByText('Create Note')).toBeTruthy();

    fireEvent.click(screen.getByText('Create Note'));
  });

  it('renders the modal with correct title and description', () => {
    (useCreateNote as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<CreateNoteModal />);
    fireEvent.click(screen.getByText('Create Note'));

    expect(screen.getByText('Post Note')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Create a note for your house')).toBeTruthy();
    expect(screen.getByPlaceholderText('Note text...')).toBeTruthy();
  });

  it('allows inputting text in the note field', () => {
    (useCreateNote as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<CreateNoteModal />);
    fireEvent.click(screen.getByText('Create Note'));

    const input = screen.getByPlaceholderText('Note text...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test Note' } });

    expect(input.value).toEqual('Test Note');
  });



  it('calls createNote with correct data when "Post Note" is clicked', () => {
    const mockCreateNote = jest.fn();
    (useCreateNote as jest.Mock).mockReturnValue({ mutate: mockCreateNote, isPending: false });

    render(<CreateNoteModal />);
    fireEvent.click(screen.getByText('Create Note'));

    fireEvent.change(screen.getByPlaceholderText('Note text...'), { target: { value: 'New Note' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('Post Note'));

    expect(mockCreateNote).toHaveBeenCalledWith({ text: 'New Note', favourited: true });
  });

  it('disables "Post Note" button while mutation is pending', () => {
    (useCreateNote as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });

    render(<CreateNoteModal />);
    fireEvent.click(screen.getByText('Create Note'));

    const button = screen.getByText('Post Note') as HTMLInputElement;
    expect(button.disabled).toBeTruthy();
  });
});
