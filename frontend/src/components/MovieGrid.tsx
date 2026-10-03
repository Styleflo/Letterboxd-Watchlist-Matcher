import React, { useState, useMemo } from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { ArrowUpDown, Film } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  usersChecked: string[];
  onSelectMovie: (movie: Movie) => void;
}

type SortOption = 'default' | 'year-desc' | 'year-asc' | 'title-asc';

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  usersChecked,
  onSelectMovie,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const sortedMovies = useMemo(() => {
    if (sortBy === 'default') return movies;
    
    return [...movies].sort((a, b) => {
      if (sortBy === 'year-desc') {
        const yearA = parseInt(a.year || '0', 10);
        const yearB = parseInt(b.year || '0', 10);
        return yearB - yearA;
      }
      if (sortBy === 'year-asc') {
        const yearA = parseInt(a.year || '0', 10);
        const yearB = parseInt(b.year || '0', 10);
        return yearA - yearB;
      }
      if (sortBy === 'title-asc') {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      }
      return 0;
    });
  }, [movies, sortBy]);

  return (
    <div className="space-y-4">
      {/* Grid Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-lb-panel/60 p-4 rounded-xl border border-lb-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-lb-green" />
            <span>Common Watchlist Movies</span>
            <span className="text-xs bg-lb-green/20 text-lb-green border border-lb-green/30 px-2 py-0.5 rounded-full font-semibold">
              {movies.length}
            </span>
          </h2>
          <p className="text-xs text-lb-textMuted mt-0.5">
            Present in the watchlists of:{' '}
            <span className="text-lb-light font-medium">{usersChecked.join(', ')}</span>
          </p>
        </div>

        {movies.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-lb-textMuted" />
            <label htmlFor="sort-select" className="text-xs text-lb-textMuted">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-lb-card border border-lb-borderLight text-xs text-white rounded-md px-2.5 py-1.5 focus:border-lb-green outline-none cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="year-desc">Year (Newest)</option>
              <option value="year-asc">Year (Oldest)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      {/* Responsive Movie Poster Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
        {sortedMovies.map((movie, index) => (
          <MovieCard
            key={`${movie.letterboxd_url || movie.title || index}`}
            movie={movie}
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </div>
  );
};
