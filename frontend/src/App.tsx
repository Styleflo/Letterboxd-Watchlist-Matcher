import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UserGroupManager } from './components/UserGroupManager';
import { UserNotFoundAlert } from './components/UserNotFoundAlert';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { LoadingState } from './components/LoadingState';
import { ErrorModal } from './components/ErrorModal';
import { EmptyState } from './components/EmptyState';
import { Movie, IntersectResponse, ErrorState } from './types';
import { intersectWatchlists, ApiRequestError } from './services/api';
import { Heart } from 'lucide-react';

export function App() {
  const [users, setUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<ErrorState | null>(null);
  const [unverifiedUsers, setUnverifiedUsers] = useState<{
    notFound: string[];
    private: string[];
  }>({ notFound: [], private: [] });
  const [result, setResult] = useState<IntersectResponse | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [dismissedNotFound, setDismissedNotFound] = useState(false);

  const handleAddUser = useCallback((username: string) => {
    setUsers((prev) => [...prev, username]);
  }, []);

  const handleEditUser = useCallback((index: number, newUsername: string) => {
    setUsers((prev) => {
      const oldUser = prev[index]?.toLowerCase();
      const next = [...prev];
      next[index] = newUsername;

      if (oldUser) {
        setUnverifiedUsers((current) => ({
          notFound: current.notFound.filter((u) => u.toLowerCase() !== oldUser),
          private: current.private.filter((u) => u.toLowerCase() !== oldUser),
        }));
      }

      return next;
    });
  }, []);

  const handleRemoveUser = useCallback((index: number) => {
    setUsers((prev) => {
      const removedUser = prev[index]?.toLowerCase();
      if (removedUser) {
        setUnverifiedUsers((current) => ({
          notFound: current.notFound.filter((u) => u.toLowerCase() !== removedUser),
          private: current.private.filter((u) => u.toLowerCase() !== removedUser),
        }));
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleRemoveNotFoundUsers = useCallback((usersToRemove: string[]) => {
    const toRemoveSet = new Set(usersToRemove.map((u) => u.toLowerCase()));
    setUsers((prev) => prev.filter((u) => !toRemoveSet.has(u.toLowerCase())));
    setUnverifiedUsers((current) => ({
      notFound: current.notFound.filter((u) => !toRemoveSet.has(u.toLowerCase())),
      private: current.private.filter((u) => !toRemoveSet.has(u.toLowerCase())),
    }));
  }, []);

  const handleIntersect = useCallback(async () => {
    if (users.length < 2) return;

    setIsLoading(true);
    setErrorModal(null);
    setResult(null);
    setDismissedNotFound(false);
    setUnverifiedUsers({ notFound: [], private: [] });

    const submittedUsers = [...users];

    try {
      const data = await intersectWatchlists(submittedUsers);
      setResult(data);
      const checkedSet = new Set((data.users_checked || []).map((u) => u.toLowerCase()));
      const missing = submittedUsers.filter((u) => !checkedSet.has(u.toLowerCase()));
      setUnverifiedUsers({ notFound: missing, private: [] });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setErrorModal({
          message: err.message,
          code: err.code,
          notFoundUsers: err.notFoundUsers,
          privateUsers: err.privateUsers,
        });

        if (err.notFoundUsers.length > 0 || err.privateUsers.length > 0) {
          setUnverifiedUsers({
            notFound: err.notFoundUsers,
            private: err.privateUsers,
          });
        }
      } else if (err instanceof Error) {
        setErrorModal({ message: err.message });
      } else {
        setErrorModal({
          message: 'An unexpected error occurred while communicating with the server.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  return (
    <div className="min-h-screen bg-lb-bg flex flex-col font-sans text-lb-text">
      {/* Top Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            What should we watch tonight?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-lb-textMuted max-w-xl mx-auto">
            Add multiple Letterboxd profiles to find the exact films shared across all your watchlists.
          </p>
        </div>

        {/* User Management Form */}
        <UserGroupManager
          users={users}
          notFoundUsers={unverifiedUsers.notFound}
          privateUsers={unverifiedUsers.private}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onRemoveUser={handleRemoveUser}
          onSubmit={handleIntersect}
          isLoading={isLoading}
        />

        {/* Not Found Users Alert from partial success */}
        {!isLoading && result && unverifiedUsers.notFound.length > 0 && !dismissedNotFound && (
          <UserNotFoundAlert
            notFoundUsers={unverifiedUsers.notFound}
            onRemoveNotFound={handleRemoveNotFoundUsers}
            onDismiss={() => setDismissedNotFound(true)}
          />
        )}

        {/* Dynamic State Views */}
        {isLoading && <LoadingState />}

        {!isLoading && result && (
          (() => {
            const hasTiersWithMovies =
              Boolean(result.movies) &&
              Object.values(result.movies || {}).some((t) => t.movies && t.movies.length > 0);
            const hasLegacyMovies =
              Boolean(result.common_movies) && (result.common_movies?.length || 0) > 0;
            const hasMovies = (result.total_movies_found ?? 0) > 0 || hasTiersWithMovies || hasLegacyMovies;

            return hasMovies ? (
              <MovieGrid
                tiers={result.movies}
                totalMoviesFound={result.total_movies_found}
                totalUsers={result.total_users}
                movies={result.common_movies}
                usersChecked={result.users_checked}
                onSelectMovie={setSelectedMovie}
              />
            ) : (
              <EmptyState usersChecked={result.users_checked} />
            );
          })()
        )}
      </main>

      {/* Error Pop-in Modal */}
      <ErrorModal
        error={errorModal}
        onClose={() => setErrorModal(null)}
      />

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      {/* Footer */}
      <footer className="border-t border-lb-border bg-lb-panel/50 py-6 mt-12 text-center text-xs text-lb-textMuted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Letterboxd Watchlist Matcher</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-lb-orange fill-lb-orange inline" /> for movie lovers by <span className="text-white font-medium">Florian Touraine</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
