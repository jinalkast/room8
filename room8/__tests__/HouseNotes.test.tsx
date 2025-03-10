import { render, screen } from '@testing-library/react';
import HouseNotes from '@/app/(main)/house-settings/components/house-notes';
import useGetNotes from '@/app/(main)/house-settings/hooks/useGetNotes';
import CreateNoteModal from '@/app/(main)/house-settings/components/create-note-modal';
import NoteItem from '@/app/(main)/house-settings/components/note-item';
import { TNote } from '@/app/(main)/house-settings/types';
import QueryProvider from '@/components/query-provider';

jest.mock('@/app/(main)/house-settings/hooks/useGetNotes', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/(main)/house-settings/components/create-note-modal', () => () => <div>Create Note</div>);
// jest.mock('@/components/loading', () => () => <div>Loading...</div>);
jest.mock('@/app/(main)/house-settings/components/note-item', () => ({ note } : { note: TNote }) => <div>{note.text}</div>);

describe('HouseNotes Component', () => {
  it('renders loading state', () => {
    (useGetNotes as jest.Mock).mockReturnValue({ data: null, isLoading: true });

    render(
        <QueryProvider>
            <HouseNotes />
        </QueryProvider>
);

    expect(screen.getByRole('loading')).toBeTruthy();
  });

  it('renders empty state when no notes', () => {
    (useGetNotes as jest.Mock).mockReturnValue({ data: [], isLoading: false });

    render(<HouseNotes />);

    expect(screen.getByText('Create Note')).toBeTruthy();
  });

  it('renders notes when data is available', () => {
    (useGetNotes as jest.Mock).mockReturnValue({
      data: [
        {   createdAt: '2024-01-01T00:00:00Z',
            favourited: false,
            houseId: '123',
            id: '1',
            posterId: '1',
            text: 'First Note', 
        },
        {   createdAt: '2024-01-02T00:00:00Z',
            favourited: false,
            houseId: '123',
            id: '2',
            posterId: '1',
            text: 'Second Note', 
        },
      ],
      isLoading: false,
    });

    render(<HouseNotes />);

    expect(screen.getByText('First Note')).toBeTruthy();
    expect(screen.getByText('Second Note')).toBeTruthy();
    expect(screen.getByText('Create Note')).toBeTruthy();
  });
});
