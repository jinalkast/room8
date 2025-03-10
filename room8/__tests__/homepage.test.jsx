import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';

describe('HomePage Component', () => {
  it('renders the main heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { level: 1, name: /ROOM8/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the subheading with correct text', () => {
    render(<HomePage />);

    const subheading = screen.getByRole('heading', {
      level: 2,
      name: /Proof of Concept Demo By Team 19/i
    });

    expect(subheading).toBeInTheDocument();
  });

  it('renders the "Sign In" button', () => {
    render(<HomePage />);

    const button = screen.getByRole('button', { name: /Sign In/i });
    expect(button).toBeInTheDocument();
  });

  it('has a link to /auth on the "Sign In" button', () => {
    render(<HomePage />);

    const link = screen.getByRole('link', { name: /Sign In/i });
    expect(link).toHaveAttribute('href', '/auth');
  });
});
