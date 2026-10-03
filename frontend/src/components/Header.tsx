import React from 'react';
import { Film } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-lb-border bg-lb-panel sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-lb-orange shadow-sm" />
            <span className="w-3.5 h-3.5 rounded-full bg-lb-green shadow-sm" />
            <span className="w-3.5 h-3.5 rounded-full bg-lb-blue shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              Letterboxd <span className="text-lb-green font-normal text-sm sm:text-base">Match</span>
            </span>
          </div>
        </div>

        {/* Tagline / Subtitle */}
        <div className="flex items-center text-xs sm:text-sm text-lb-text gap-2 font-medium">
          <Film className="w-4 h-4 text-lb-green hidden sm:inline" />
          <span className="hidden sm:inline">Find movies in common watchlists</span>
          <span className="sm:hidden text-lb-textMuted">Watchlist Matcher</span>
        </div>
      </div>
    </header>
  );
};
