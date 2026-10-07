import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface UserNotFoundAlertProps {
  notFoundUsers: string[];
  onRemoveNotFound: (usernames: string[]) => void;
  onDismiss?: () => void;
}

export const UserNotFoundAlert: React.FC<UserNotFoundAlertProps> = ({
  notFoundUsers,
  onRemoveNotFound,
  onDismiss,
}) => {
  if (notFoundUsers.length === 0) return null;

  const isPlural = notFoundUsers.length > 1;

  return (
    <div
      role="alert"
      className="mb-6 bg-lb-panel/95 border border-lb-orange/40 rounded-xl p-4 sm:p-5 shadow-lg animate-fadeIn flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-lb-orange/15 rounded-lg border border-lb-orange/30 text-lb-orange flex-shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">
              {isPlural ? 'Letterboxd accounts not found' : 'Letterboxd account not found'}
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lb-orange/20 text-lb-orange border border-lb-orange/40">
              Excluded
            </span>
          </div>
          <p className="text-xs sm:text-sm text-lb-textMuted leading-relaxed">
            {isPlural ? (
              <>
                The following users do not exist on Letterboxd or have no public profile:
              </>
            ) : (
              <>
                The user below does not exist on Letterboxd or has no public profile:
              </>
            )}{' '}
            <span className="inline-flex flex-wrap gap-1 mt-1 sm:mt-0">
              {notFoundUsers.map((user) => (
                <span
                  key={user}
                  className="font-mono text-xs font-semibold text-white bg-lb-card border border-lb-borderLight px-2 py-0.5 rounded"
                >
                  @{user}
                </span>
              ))}
            </span>
          </p>
          <p className="text-[11px] text-lb-textMuted">
            Results below only compare watchlists of the verified accounts.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          type="button"
          onClick={() => onRemoveNotFound(notFoundUsers)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lb-card hover:bg-lb-hover border border-lb-border hover:border-lb-orange/50 text-lb-light hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-lb-orange" />
          <span>Remove {isPlural ? 'these users' : 'this user'}</span>
        </button>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 text-lb-textMuted hover:text-white rounded-lg hover:bg-lb-hover transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
