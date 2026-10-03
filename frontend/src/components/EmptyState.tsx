import React from 'react';
import { Film, Popcorn } from 'lucide-react';

interface EmptyStateProps {
  usersChecked: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({ usersChecked }) => {
  return (
    <div className="bg-lb-panel border border-lb-border rounded-xl p-8 text-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-full bg-lb-card border border-lb-border text-lb-textMuted flex items-center justify-center mx-auto mb-4">
        <Popcorn className="w-7 h-7 text-lb-orange" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        No Common Movies Found
      </h3>
      <p className="text-xs sm:text-sm text-lb-textMuted leading-relaxed">
        There are currently no movies in common between the watchlists of{' '}
        <span className="text-lb-light font-medium">{usersChecked.join(', ')}</span>.
      </p>
      <div className="mt-4 pt-4 border-t border-lb-border flex items-center justify-center gap-2 text-xs text-lb-textMuted">
        <Film className="w-4 h-4 text-lb-green" />
        <span>Try adding more friends or adding more films to your watchlists!</span>
      </div>
    </div>
  );
};
