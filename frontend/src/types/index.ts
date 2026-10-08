export interface Movie {
  title: string | null;
  letterboxd_url: string | null;
  poster: string | null;
  year: string | null;
  summary: string | null;
}

export interface MovieTier {
  label: string;
  count: number;
  movies: Movie[];
}

export interface IntersectResponse {
  users_checked: string[];
  total_users?: number;
  total_movies_found?: number;
  movies?: Record<string, MovieTier>;
  // Backwards compatibility with previous payload
  common_count?: number;
  common_movies?: Movie[];
}

export interface ApiErrorDetail {
  code?: string;
  message?: string;
  not_found?: string[];
  private?: string[];
}

export interface ErrorState {
  message: string;
  code?: string;
  notFoundUsers?: string[];
  privateUsers?: string[];
}

export interface ApiError {
  detail: string | ApiErrorDetail;
}
