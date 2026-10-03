import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (movie) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const displayTitle = movie.title || 'Untitled';
  const displayYear = movie.year || 'Year unknown';
  const displaySummary = movie.summary || 'No description available for this film.';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-lb-panel border border-lb-borderLight rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 text-lb-text hover:text-white bg-lb-bg/70 hover:bg-lb-hover rounded-full transition-colors cursor-pointer border border-lb-border"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
            {/* Poster */}
            <div className="w-36 sm:w-48 flex-shrink-0 self-center sm:self-start">
              <div className="aspect-poster rounded-lg overflow-hidden bg-lb-card border border-lb-border shadow-lg">
                {movie.poster && !imageError ? (
                  <img
                    src={movie.poster}
                    alt={`${displayTitle} poster`}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-lb-card text-lb-textMuted">
                    <Film className="w-12 h-12 mb-2 text-lb-borderLight" />
                    <span className="text-xs">{displayTitle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2
                  id="movie-modal-title"
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                >
                  {displayTitle}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-lb-textMuted font-medium">
                  <Calendar className="w-4 h-4 text-lb-green" />
                  <span>{displayYear}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-lb-border">
                  <h4 className="text-xs uppercase tracking-wider text-lb-textMuted font-semibold mb-2">
                    Synopsis
                  </h4>
                  <p className="text-sm text-lb-light/90 leading-relaxed max-h-48 sm:max-h-60 overflow-y-auto pr-1">
                    {displaySummary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-lb-border flex flex-col sm:flex-row items-center gap-3">
                {movie.letterboxd_url ? (
                  <a
                    href={movie.letterboxd_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-lb-orange hover:bg-lb-orange-hover text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md cursor-pointer"
                  >
                    <span>Open on Letterboxd</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-xs text-lb-textMuted italic">
                    Letterboxd URL unavailable
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-lb-card hover:bg-lb-hover border border-lb-border text-lb-text hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
