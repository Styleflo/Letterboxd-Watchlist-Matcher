import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types';

const mockMovie: Movie = {
  title: 'Inception',
  year: '2010',
  poster: 'https://example.com/poster.jpg',
  letterboxd_url: 'https://letterboxd.com/film/inception/',
  summary: 'A thief who steals corporate secrets through dream-sharing technology.',
};

describe('MovieCard', () => {
  it('renders title and release year', () => {
    render(<MovieCard movie={mockMovie} onSelect={vi.fn()} />);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getAllByText('2010').length).toBeGreaterThan(0);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockMovie.poster);
  });

  it('triggers onSelect when clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<MovieCard movie={mockMovie} onSelect={handleSelect} />);

    const cardButton = screen.getByRole('button', { name: /View details for Inception/i });
    await user.click(cardButton);

    expect(handleSelect).toHaveBeenCalledWith(mockMovie);
  });
});
