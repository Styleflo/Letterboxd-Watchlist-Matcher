import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
      {/* Animated Letterboxd 3-dot pulse */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-5 h-5 rounded-full bg-lb-orange animate-bounce [animation-delay:-0.3s]" />
        <div className="w-5 h-5 rounded-full bg-lb-green animate-bounce [animation-delay:-0.15s]" />
        <div className="w-5 h-5 rounded-full bg-lb-blue animate-bounce" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Scanning Letterboxd Watchlists...
      </h3>
      <p className="text-xs sm:text-sm text-lb-textMuted max-w-md">
        We are retrieving and calculating the intersection of films across all specified accounts. This may take a few seconds.
      </p>

      {/* Placeholder Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 w-full max-w-5xl mt-8 opacity-40">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <div className="aspect-poster bg-lb-card rounded-md animate-pulse" />
            <div className="h-3 bg-lb-card rounded w-3/4 animate-pulse" />
            <div className="h-2.5 bg-lb-card rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
