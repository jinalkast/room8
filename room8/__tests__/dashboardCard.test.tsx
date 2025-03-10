import { render, screen, fireEvent } from '@testing-library/react';
import DashboardCards from '@/app/(main)/dashboard/components/dashboard-cards';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('DashboardCards Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders all dashboard cards', () => {
    render(<DashboardCards />);
    
    const cardNames = [
      'Cleanliness Manager',
      'Bill Splitter',
      'Chore Schedule',
      'ChatBot',
      'My House',
      'Settings'
    ];

    cardNames.forEach((name) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('navigates to the correct page on click', () => {
    render(<DashboardCards />);
    
    const billSplitterCard = screen.getByText('Bill Splitter');
    fireEvent.click(billSplitterCard);

    expect(mockPush).toHaveBeenCalledWith('/bill-splitter');
  });
});
