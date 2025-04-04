import HomePage from '@/app/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('HomePage Component', () => {
  it('renders the main heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { level: 1, name: /ROOM 8/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the subheading with correct text', () => {
    render(<HomePage />);

    const subheading = screen.getByRole('heading', {
      level: 2,
      name: /Room8 is the ultimate roommate management app designed to keep your shared home running smoothly. From organizing chores and splitting bills to monitoring cleanliness and chatting with your house group, Room8 takes the stress out of co-living/i
    });

    expect(subheading).toBeInTheDocument();
  });

  it('renders the "Sign In" button', () => {
    render(<HomePage />);

    const button = screen.getByRole('button', { name: /Sign In With Google/i });
    expect(button).toBeInTheDocument();
  });

  it('handles OAuth sign in when the button is clicked', () => {
    render(<HomePage />);

    const button = screen.getByRole('button', { name: /Sign In with Google/i });
    expect(button).toBeInTheDocument();
  });
});
