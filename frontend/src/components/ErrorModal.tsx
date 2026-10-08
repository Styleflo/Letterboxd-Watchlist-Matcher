import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, X, Lock } from 'lucide-react';
import { ErrorState } from '../types';

interface ErrorModalProps {
  error: ErrorState | null;
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose, onRetry }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (error) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [error, onClose]);

  if (!error) return null;

  const isUserValidationError = error.code === 'USER_VALIDATION_ERROR';
  const hasNotFound = Boolean(error.notFoundUsers && error.notFoundUsers.length > 0);
  const hasPrivate = Boolean(error.privateUsers && error.privateUsers.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-desc"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-lb-panel border border-red-800/60 rounded-2xl shadow-2xl p-6 text-center animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-lb-textMuted hover:text-white rounded-lg hover:bg-lb-hover transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Error Icon */}
        <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-800/50">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3
          id="error-modal-title"
          className="text-lg font-bold text-white mb-2"
        >
          {isUserValidationError
            ? 'User Verification Failed'
            : 'Unable to Fetch Common Watchlists'}
        </h3>

        {/* Error Description */}
        <p
          id="error-modal-desc"
          className="text-xs sm:text-sm text-red-300/90 mb-5 leading-relaxed whitespace-pre-line"
        >
          {error.message}
        </p>

        {/* Marked Users Display for USER_VALIDATION_ERROR */}
        {(hasNotFound || hasPrivate) && (
          <div className="mb-6 p-3.5 bg-lb-card/80 border border-lb-border rounded-xl text-left space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-lb-textMuted">
              Affected Users
            </div>
            <div className="flex flex-wrap gap-2">
              {error.notFoundUsers?.map((username) => (
                <span
                  key={username}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-950/60 border border-red-800/80 text-red-200 px-2.5 py-1 rounded-md"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>@{username}</span>
                  <span className="text-[10px] text-red-400 uppercase font-bold">
                    (Not found)
                  </span>
                </span>
              ))}

              {error.privateUsers?.map((username) => (
                <span
                  key={username}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-950/60 border border-purple-800/80 text-purple-200 px-2.5 py-1 rounded-md"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>@{username}</span>
                  <span className="text-[10px] text-purple-400 uppercase font-bold">
                    (Private)
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="inline-flex items-center gap-2 bg-red-900/60 hover:bg-red-800/80 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg transition-colors border border-red-700/50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-lb-card hover:bg-lb-hover border border-lb-border text-lb-text hover:text-white rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
