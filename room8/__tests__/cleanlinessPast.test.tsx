import { render, screen } from '@testing-library/react';
import CleanlinessPast from '@/app/(main)/cleanliness-manager/components/cleanliness-past';
import { TCleanlinessLog } from '@/lib/types';
import '@testing-library/jest-dom';

jest.mock('@/app/(main)/cleanliness-manager/components/cleanliness-details-modal', () => {
  return function MockCleanlinessDetailsModal({ cleanlinessLogId }: { cleanlinessLogId: string }) {
    return <button data-testid={`details-modal-${cleanlinessLogId}`}>View Details</button>;
  };
});

describe('CleanlinessPast Component', () => {
  const mockCleanlinessLogs: TCleanlinessLog[] = [
    {
      id: '1',
      created_at: '2023-05-01T10:00:00Z',
      before_image_url: 'before1.jpg',
      after_image_url: 'after1.jpg'
    },
    {
      id: '2',
      created_at: '2023-05-02T11:00:00Z',
      before_image_url: 'before2.jpg',
      after_image_url: 'after2.jpg'
    },
    {
      id: '3',
      created_at: '2023-05-03T12:00:00Z',
      before_image_url: 'before3.jpg',
      after_image_url: 'after3.jpg'
    }
  ];

  test('renders loading spinner when cleanlinessLogs is null', () => {
    render(<CleanlinessPast cleanlinessLogs={null} />);
    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('renders loading spinner when cleanlinessLogs is undefined', () => {
    render(<CleanlinessPast cleanlinessLogs={undefined} />);
    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('renders "No logs" when cleanlinessLogs is empty', () => {
    render(<CleanlinessPast cleanlinessLogs={[]} />);
    expect(screen.getByText('No logs')).toBeInTheDocument();
  });

  test('renders past cleanliness logs correctly (excluding the first/most recent)', () => {
    render(<CleanlinessPast cleanlinessLogs={mockCleanlinessLogs} />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);

    expect(screen.getByText(/May 2, 2023/)).toBeInTheDocument();
    expect(screen.getByText(/May 3, 2023/)).toBeInTheDocument();

    expect(screen.queryByTestId('details-modal-1')).not.toBeInTheDocument();

    expect(screen.getByTestId('details-modal-2')).toBeInTheDocument();
    expect(screen.getByTestId('details-modal-3')).toBeInTheDocument();
  });

  test('renders the correct heading and description', () => {
    render(<CleanlinessPast cleanlinessLogs={mockCleanlinessLogs} />);

    expect(screen.getByText('Past Events')).toBeInTheDocument();
    expect(
      screen.getByText(/See what changes were made to your shared space and assign cleanup tasks/)
    ).toBeInTheDocument();
  });

  test('renders the table caption', () => {
    render(<CleanlinessPast cleanlinessLogs={mockCleanlinessLogs} />);

    expect(screen.getByText(/Past events in your shared living space/)).toBeInTheDocument();
  });
});
