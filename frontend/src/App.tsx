import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UserGroupManager } from './components/UserGroupManager';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { LoadingState } from './components/LoadingState';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { Movie, IntersectResponse } from './types';
import { intersectWatchlists, ApiRequestError } from './services/api';
import { Heart } from 'lucide-react';

export function App() {
  const [users, setUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IntersectResponse | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleAddUser = useCallback((username: string) => {
    setUsers((prev) => [...prev, username]);
  }, []);

  const handleEditUser = useCallback((index: number, newUsername: string) => {
    setUsers((prev) => {
      const next = [...prev];
      next[index] = newUsername;
      return next;
    });
  }, []);

  const handleRemoveUser = useCallback((index: number) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleIntersect = useCallback(async () => {
    if (users.length < 2) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await intersectWatchlists(users);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while communicating with the server.');
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
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onRemoveUser={handleRemoveUser}
          onSubmit={handleIntersect}
          isLoading={isLoading}
        />

        {/* Dynamic State Views */}
        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <ErrorMessage message={error} onRetry={handleIntersect} />
        )}

        {!isLoading && !error && result && (
          <>
            {result.common_movies && result.common_movies.length > 0 ? (
              <MovieGrid
                movies={result.common_movies}
                usersChecked={result.users_checked}
                onSelectMovie={setSelectedMovie}
              />
            ) : (
              <EmptyState usersChecked={result.users_checked} />
            )}
          </>
        )}
      </main>

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
