import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const displayTitle = movie.title || 'Untitled';
  const displayYear = movie.year || '';

  return (
    <button
      type="button"
      onClick={() => onSelect(movie)}
      className="group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lb-green rounded-lg transition-transform duration-200 hover:-translate-y-1 w-full"
      aria-label={`View details for ${displayTitle} (${displayYear})`}
    >
      {/* Poster Container */}
      <div className="relative aspect-poster w-full rounded-md overflow-hidden bg-lb-card border border-lb-border group-hover:border-lb-green/80 group-hover:shadow-lb-glow transition-all duration-200">
        {movie.poster && !imageError ? (
          <img
            src={movie.poster}
            alt={`${displayTitle} poster`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-lb-panel to-lb-card text-lb-textMuted">
            <Film className="w-10 h-10 mb-2 text-lb-borderLight" />
            <span className="text-xs font-medium text-lb-text line-clamp-3 px-1">{displayTitle}</span>
          </div>
        )}

        {/* Release year pill overlay on poster corner */}
        {displayYear && (
          <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-lb-light text-[11px] font-semibold px-1.5 py-0.5 rounded border border-white/10">
            {displayYear}
          </div>
        )}
      </div>

      {/* Movie Information beneath poster */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-semibold text-white group-hover:text-lb-green transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        <p className="text-xs text-lb-textMuted mt-0.5">
          {displayYear ? `${displayYear}` : 'Release year unavailable'}
        </p>
      </div>
    </button>
  );
};
