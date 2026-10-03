import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MovieModal } from '../components/MovieModal';
import { Movie } from '../types';

const mockMovie: Movie = {
  title: 'Parasite',
  year: '2019',
  poster: 'https://example.com/parasite.jpg',
  letterboxd_url: 'https://letterboxd.com/film/parasite-2019/',
  summary: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
};

describe('MovieModal', () => {
  it('does not render when movie is null', () => {
    const { container } = render(<MovieModal movie={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders movie details, synopsis and Letterboxd link', () => {
    render(<MovieModal movie={mockMovie} onClose={vi.fn()} />);

    expect(screen.getByText('Parasite')).toBeInTheDocument();
    expect(screen.getByText('2019')).toBeInTheDocument();
    expect(screen.getByText(/Greed and class discrimination/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Open on Letterboxd/i });
    expect(link).toHaveAttribute('href', 'https://letterboxd.com/film/parasite-2019/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<MovieModal movie={mockMovie} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});
