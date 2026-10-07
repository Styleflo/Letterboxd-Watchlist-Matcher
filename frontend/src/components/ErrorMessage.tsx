import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-950/30 border border-red-800/60 rounded-xl p-5 sm:p-6 text-center max-w-2xl mx-auto my-6 animate-fadeIn">
      <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-200 mb-1">
        Unable to Fetch Common Watchlists
      </h3>
      <p className="text-xs sm:text-sm text-red-300/80 mb-3 max-w-lg mx-auto leading-relaxed">
        {message}
      </p>

      {message.toLowerCase().includes('letterboxd account') && (
        <div className="mb-4 inline-block bg-lb-card/80 border border-lb-orange/40 rounded-lg px-3 py-1.5 text-xs text-lb-orange">
          Tip: One or more usernames could not be verified on Letterboxd. Please check for typos or ensure their accounts are public.
        </div>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-red-900/60 hover:bg-red-800/80 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-red-700/50 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
