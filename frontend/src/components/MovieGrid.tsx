import React, { useState, useMemo, useCallback } from 'react';
import { Movie, MovieTier } from '../types';
import { MovieCard } from './MovieCard';
import { ArrowUpDown, Film, Users, Sparkles } from 'lucide-react';

interface MovieGridProps {
  tiers?: Record<string, MovieTier>;
  totalMoviesFound?: number;
  totalUsers?: number;
  movies?: Movie[];
  usersChecked: string[];
  onSelectMovie: (movie: Movie) => void;
}

type SortOption = 'default' | 'year-desc' | 'year-asc' | 'title-asc';

interface NormalizedTier {
  key: string;
  userCount: number;
  label: string;
  count: number;
  movies: Movie[];
  isAllUsers: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  tiers,
  totalMoviesFound,
  totalUsers,
  movies,
  usersChecked,
  onSelectMovie,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedTierKey, setSelectedTierKey] = useState<string>('all');

  const resolvedTotalUsers = totalUsers || usersChecked.length;

  // Normalize tiers from either dictionary or legacy flat array
  const normalizedTiers = useMemo<NormalizedTier[]>(() => {
    if (tiers && Object.keys(tiers).length > 0) {
      return Object.entries(tiers)
        .map(([key, tier]) => {
          const uCount = parseInt(key, 10) || 0;
          return {
            key,
            userCount: uCount,
            label: tier.label || `Shared by ${key}/${resolvedTotalUsers} users`,
            count: tier.count ?? (tier.movies ? tier.movies.length : 0),
            movies: tier.movies || [],
            isAllUsers: uCount === resolvedTotalUsers,
          };
        })
        .sort((a, b) => b.userCount - a.userCount);
    }

    if (movies && movies.length > 0) {
      return [
        {
          key: String(resolvedTotalUsers),
          userCount: resolvedTotalUsers,
          label: `Shared by ${resolvedTotalUsers}/${resolvedTotalUsers} users`,
          count: movies.length,
          movies,
          isAllUsers: true,
        },
      ];
    }

    return [];
  }, [tiers, movies, resolvedTotalUsers]);

  // Total count calculation
  const totalCount = useMemo(() => {
    if (typeof totalMoviesFound === 'number') return totalMoviesFound;
    return normalizedTiers.reduce((acc, t) => acc + t.count, 0);
  }, [totalMoviesFound, normalizedTiers]);

  // Sort helper
  const sortMovies = useCallback((movieList: Movie[]) => {
    if (sortBy === 'default') return movieList;

    return [...movieList].sort((a, b) => {
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
  }, [sortBy]);

  // Filter tiers to display
  const displayedTiers = useMemo(() => {
    if (selectedTierKey === 'all') {
      return normalizedTiers;
    }
    return normalizedTiers.filter((t) => t.key === selectedTierKey);
  }, [normalizedTiers, selectedTierKey]);

  return (
    <div className="space-y-6">
      {/* Grid Header & Sort Controls */}
      <div className="bg-lb-panel/80 p-4 sm:p-5 rounded-xl border border-lb-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-lb-green" />
              <span>Common Watchlist Movies</span>
              <span className="text-xs bg-lb-green/20 text-lb-green border border-lb-green/30 px-2.5 py-0.5 rounded-full font-semibold">
                {totalCount} {totalCount === 1 ? 'movie' : 'movies'}
              </span>
            </h2>
            <p className="text-xs text-lb-textMuted mt-1">
              Watchlists evaluated for:{' '}
              <span className="text-lb-light font-medium">{usersChecked.join(', ')}</span>
            </p>
          </div>

          {totalCount > 1 && (
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

        {/* Tier Filter Pills (rendered when more than 1 tier exists) */}
        {normalizedTiers.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-lb-border/70">
            <span className="text-xs text-lb-textMuted mr-1">Filter by match:</span>
            <button
              type="button"
              onClick={() => setSelectedTierKey('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                selectedTierKey === 'all'
                  ? 'bg-lb-hover text-white border-lb-borderLight'
                  : 'bg-lb-card text-lb-text hover:text-white border-lb-border hover:border-lb-borderLight'
              }`}
            >
              All Matches ({totalCount})
            </button>
            {normalizedTiers.map((tier) => {
              const isSelected = selectedTierKey === tier.key;
              return (
                <button
                  key={tier.key}
                  type="button"
                  onClick={() => setSelectedTierKey(tier.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? tier.isAllUsers
                        ? 'bg-lb-green/20 text-lb-green border-lb-green/50'
                        : 'bg-lb-orange/20 text-lb-orange border-lb-orange/50'
                      : 'bg-lb-card text-lb-text hover:text-white border-lb-border hover:border-lb-borderLight'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      tier.isAllUsers ? 'bg-lb-green' : 'bg-lb-orange'
                    }`}
                  />
                  <span>
                    {tier.label} ({tier.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tier Sections */}
      <div className="space-y-8">
        {displayedTiers.map((tier) => {
          const sortedList = sortMovies(tier.movies);

          return (
            <section
              key={tier.key}
              className="bg-lb-panel/40 border border-lb-border/80 rounded-xl p-4 sm:p-5 space-y-4"
            >
              {/* Tier Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-lb-border/70">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg border ${
                      tier.isAllUsers
                        ? 'bg-lb-green/10 border-lb-green/30 text-lb-green'
                        : 'bg-lb-orange/10 border-lb-orange/30 text-lb-orange'
                    }`}
                  >
                    {tier.isAllUsers ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">
                        {tier.label}
                      </h3>
                      {tier.isAllUsers ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lb-green/20 text-lb-green border border-lb-green/40">
                          All Users
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lb-orange/20 text-lb-orange border border-lb-orange/40">
                          Partial Match
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-xs text-lb-textMuted">
                  {tier.count} {tier.count === 1 ? 'film in common' : 'films in common'}
                </span>
              </div>

              {/* Movies Grid or Empty Tier notice */}
              {sortedList.length > 0 ? (
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
                  {sortedList.map((movie, index) => (
                    <MovieCard
                      key={`${movie.letterboxd_url || movie.title || index}`}
                      movie={movie}
                      onSelect={onSelectMovie}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs sm:text-sm text-lb-textMuted">
                  No movies in this tier.
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
