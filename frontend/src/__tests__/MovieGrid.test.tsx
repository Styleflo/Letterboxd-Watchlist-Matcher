import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MovieGrid } from '../components/MovieGrid';
import { MovieTier } from '../types';

const mockTiers: Record<string, MovieTier> = {
  '3': {
    label: 'Shared by 3/3 users',
    count: 1,
    movies: [
      {
        title: 'Spirited Away',
        year: '2001',
        poster: 'https://example.com/spirited.jpg',
        letterboxd_url: 'https://letterboxd.com/film/spirited-away/',
        summary: 'A young girl wanders into a world ruled by gods, witches, and spirits.',
      },
    ],
  },
  '2': {
    label: 'Shared by 2/3 users',
    count: 2,
    movies: [
      {
        title: 'Arrival',
        year: '2016',
        poster: 'https://example.com/arrival.jpg',
        letterboxd_url: 'https://letterboxd.com/film/arrival-2016/',
        summary: 'A linguist works to interpret the language of alien visitors.',
      },
      {
        title: 'Blade Runner 2049',
        year: '2017',
        poster: 'https://example.com/br2049.jpg',
        letterboxd_url: 'https://letterboxd.com/film/blade-runner-2049/',
        summary: 'A young blade runner unearths a long-buried secret.',
      },
    ],
  },
};

describe('MovieGrid', () => {
  it('renders all tiers with match badges and movie cards', () => {
    render(
      <MovieGrid
        tiers={mockTiers}
        totalMoviesFound={3}
        totalUsers={3}
        usersChecked={['alice', 'bob', 'charlie']}
        onSelectMovie={vi.fn()}
      />
    );

    // Checks header & total count
    expect(screen.getByText(/Common Watchlist Movies/i)).toBeInTheDocument();
    expect(screen.getByText('3 movies')).toBeInTheDocument();

    // Checks tier labels & badges
    expect(screen.getAllByText('Shared by 3/3 users').length).toBeGreaterThan(0);
    expect(screen.getByText('All Users')).toBeInTheDocument();
    expect(screen.getAllByText('Shared by 2/3 users').length).toBeGreaterThan(0);
    expect(screen.getByText('Partial Match')).toBeInTheDocument();

    // Checks movies
    expect(screen.getByText('Spirited Away')).toBeInTheDocument();
    expect(screen.getByText('Arrival')).toBeInTheDocument();
    expect(screen.getByText('Blade Runner 2049')).toBeInTheDocument();
  });

  it('filters tiers when clicking filter pills', async () => {
    const user = userEvent.setup();

    render(
      <MovieGrid
        tiers={mockTiers}
        totalMoviesFound={3}
        totalUsers={3}
        usersChecked={['alice', 'bob', 'charlie']}
        onSelectMovie={vi.fn()}
      />
    );

    // Initially all movies are visible
    expect(screen.getByText('Spirited Away')).toBeInTheDocument();
    expect(screen.getByText('Arrival')).toBeInTheDocument();

    // Click on "Shared by 3/3 users" pill
    const filterPill3 = screen.getByRole('button', { name: /Shared by 3\/3 users/i });
    await user.click(filterPill3);

    // Only tier 3 movie should be visible
    expect(screen.getByText('Spirited Away')).toBeInTheDocument();
    expect(screen.queryByText('Arrival')).not.toBeInTheDocument();
  });

  it('invokes onSelectMovie when a movie card is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <MovieGrid
        tiers={mockTiers}
        totalMoviesFound={3}
        totalUsers={3}
        usersChecked={['alice', 'bob', 'charlie']}
        onSelectMovie={handleSelect}
      />
    );

    const movieBtn = screen.getByRole('button', { name: /View details for Spirited Away/i });
    await user.click(movieBtn);

    expect(handleSelect).toHaveBeenCalledWith(mockTiers['3'].movies[0]);
  });
});
