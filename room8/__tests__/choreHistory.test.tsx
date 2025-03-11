import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChoreHistory from '../src/app/(main)/schedule/components/chore-history';
import useAllCompletedChores from '../src/app/(main)/schedule/hooks/useGetAllCompletedChores';

jest.mock('../src/app/(main)/schedule/hooks/useGetAllCompletedChores');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('ChoreHistory Component', () => {
  const mockCompletedChores = [
    {
      id: 1,
      created_at: '2023-05-10T15:00:00Z',
      responsible: {
        profile: {
          name: 'John Doe',
          image_url: '/john.jpg'
        }
      },
      chore: {
        chores: {
          title: 'Clean Kitchen'
        }
      }
    },
    {
      id: 2,
      created_at: '2023-05-11T14:30:00Z',
      responsible: {
        profile: {
          name: 'Jane Smith',
          image_url: '/jane.jpg'
        }
      },
      chore: {
        chores: {
          title: 'Take Out Trash'
        }
      }
    }
  ];

  beforeEach(() => {
    (useAllCompletedChores as jest.Mock).mockReturnValue({
      data: mockCompletedChores,
      isLoading: false
    });
  });

  it('renders the chore history title and description', () => {
    render(<ChoreHistory />);

    expect(screen.getByText('Chore History')).toBeInTheDocument();
    expect(screen.getByText('View completed chores history.')).toBeInTheDocument();
  });

  it('displays loading spinner when data is loading', () => {
    (useAllCompletedChores as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    });

    render(<ChoreHistory />);
    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  it('renders completed chores with correct information', async () => {
    render(<ChoreHistory />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText(/Completed Clean Kitchen on/)).toBeInTheDocument();
      expect(screen.getByText(/Completed Take Out Trash on/)).toBeInTheDocument();
    });

    const date1 = new Date('2023-05-10T15:00:00Z').toLocaleDateString();
    const date2 = new Date('2023-05-11T14:30:00Z').toLocaleDateString();

    expect(screen.getByText(date1)).toBeInTheDocument();
    expect(screen.getByText(date2)).toBeInTheDocument();
  });

  it('renders profile images for each completed chore', () => {
    render(<ChoreHistory />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/john.jpg');
    expect(images[1]).toHaveAttribute('src', '/jane.jpg');
  });

  it('renders empty history when no completed chores', async () => {
    (useAllCompletedChores as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    render(<ChoreHistory />);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('handles null chore data gracefully', async () => {
    const malformedData = [
      {
        id: 3,
        created_at: '2023-05-12T10:00:00Z',
        responsible: {
          profile: {
            name: 'Bob Johnson',
            image_url: '/bob.jpg'
          }
        },
        chore: null
      }
    ];

    (useAllCompletedChores as jest.Mock).mockReturnValue({
      data: malformedData,
      isLoading: false
    });

    render(<ChoreHistory />);

    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument();
  });
});
