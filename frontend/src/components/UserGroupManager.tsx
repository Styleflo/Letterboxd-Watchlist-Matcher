import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, X, Edit2, Check, Users, Sparkles, AlertCircle, AlertTriangle, Lock } from 'lucide-react';

interface UserGroupManagerProps {
  users: string[];
  notFoundUsers?: string[];
  privateUsers?: string[];
  onAddUser: (username: string) => void;
  onEditUser: (index: number, newUsername: string) => void;
  onRemoveUser: (index: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UserGroupManager: React.FC<UserGroupManagerProps> = ({
  users,
  notFoundUsers = [],
  privateUsers = [],
  onAddUser,
  onEditUser,
  onRemoveUser,
  onSubmit,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingIndex]);

  const handleAddUser = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim().toLowerCase();
    
    if (!trimmed) return;

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setValidationError('Username can only contain letters, numbers, hyphens, and underscores.');
      return;
    }

    if (users.map((u) => u.toLowerCase()).includes(trimmed)) {
      setValidationError(`User "${trimmed}" is already in the list.`);
      return;
    }

    setValidationError(null);
    onAddUser(trimmed);
    setInputValue('');
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(users[index]);
    setValidationError(null);
  };

  const saveEditing = (index: number) => {
    const trimmed = editingValue.trim().toLowerCase();
    if (!trimmed) {
      setEditingIndex(null);
      return;
    }

    // If unchanged, exit editing without updating
    if (trimmed === users[index]?.toLowerCase()) {
      setEditingIndex(null);
      setValidationError(null);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setValidationError('Username can only contain letters, numbers, hyphens, and underscores.');
      return;
    }

    // Check duplicate excluding self
    const otherUsers = users.filter((_, i) => i !== index).map((u) => u.toLowerCase());
    if (otherUsers.includes(trimmed)) {
      setValidationError(`User "${trimmed}" is already in the list.`);
      return;
    }

    setValidationError(null);
    onEditUser(index, trimmed);
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setValidationError(null);
  };

  return (
    <section className="bg-lb-panel border border-lb-border rounded-xl p-4 sm:p-6 shadow-lb-card mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-lb-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-lb-green" />
          <h2 className="text-lg font-semibold text-white">Compare Watchlists</h2>
        </div>
        <span className="text-xs text-lb-textMuted">
          Add at least 2 Letterboxd usernames
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. dave, filmlib, cinemaniac..."
            disabled={isLoading}
            className="w-full bg-lb-bg border border-lb-borderLight focus:border-lb-green focus:ring-1 focus:ring-lb-green text-white placeholder-lb-textMuted px-4 py-2.5 rounded-lg text-sm transition-colors outline-none"
            aria-label="Add Letterboxd username"
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="flex items-center justify-center gap-1.5 bg-lb-hover hover:bg-lb-borderLight disabled:opacity-50 text-lb-light px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer disabled:cursor-not-allowed border border-lb-borderLight"
        >
          <UserPlus className="w-4 h-4 text-lb-green" />
          <span>Add User</span>
        </button>
      </form>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-300 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Users Chips List */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-lb-textMuted font-semibold mb-2.5">
          Users in Group ({users.length})
        </div>
        {users.length === 0 ? (
          <div className="py-6 px-4 border border-dashed border-lb-border rounded-lg text-center text-sm text-lb-textMuted">
            No users added yet. Enter Letterboxd usernames above to get started.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {users.map((username, index) => {
              const isEditing = editingIndex === index;
              const isNotFound = notFoundUsers.some(
                (u) => u.toLowerCase() === username.toLowerCase()
              );
              const isPrivate = privateUsers.some(
                (u) => u.toLowerCase() === username.toLowerCase()
              );

              return (
                <div
                  key={`${username}-${index}`}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm shadow-sm transition-all border ${
                    isNotFound
                      ? 'bg-lb-card/90 border-red-700/80 text-lb-light ring-1 ring-red-500/30'
                      : isPrivate
                      ? 'bg-lb-card/90 border-purple-700/80 text-lb-light ring-1 ring-purple-500/30'
                      : 'bg-lb-card border-lb-borderLight/80 text-lb-light'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEditing(index);
                          } else if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                        className="bg-lb-bg border border-lb-green text-white text-xs px-2 py-0.5 rounded outline-none w-28 sm:w-36"
                      />
                      <button
                        type="button"
                        onClick={() => saveEditing(index)}
                        className="p-1 hover:text-lb-green text-lb-text transition-colors"
                        aria-label="Save username"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="p-1 hover:text-red-400 text-lb-text transition-colors"
                        aria-label="Cancel editing"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-white">{username}</span>
                      {isNotFound && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/50"
                          title="This account was not found on Letterboxd"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Not found</span>
                        </span>
                      )}
                      {isPrivate && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/50"
                          title="This account is private on Letterboxd"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Private</span>
                        </span>
                      )}
                      <div className="flex items-center ml-1 pl-1.5 border-l border-lb-border">
                        <button
                          type="button"
                          onClick={() => startEditing(index)}
                          disabled={isLoading}
                          className="p-1 text-lb-text hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                          title="Edit username"
                          aria-label={`Edit username ${username}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveUser(index)}
                          disabled={isLoading}
                          className="p-1 text-lb-text hover:text-red-400 transition-colors cursor-pointer disabled:opacity-40"
                          title="Remove user"
                          aria-label={`Remove user ${username}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-lb-textMuted">
          {users.length < 2 ? (
            <span className="text-lb-orange flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Add at least {2 - users.length} more user{users.length === 1 ? '' : 's'} to compare
            </span>
          ) : (
            <span className="text-lb-green flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Ready to find common watchlist films
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={users.length < 2 || isLoading}
          className="flex items-center justify-center gap-2 bg-lb-green hover:bg-lb-green-hover disabled:bg-lb-card disabled:text-lb-textMuted disabled:border disabled:border-lb-border text-lb-bg font-semibold px-6 py-3 rounded-lg text-sm shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed transform active:scale-95"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-lb-bg border-t-transparent rounded-full animate-spin" />
              <span>Scanning Watchlists...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Find Common Movies</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
