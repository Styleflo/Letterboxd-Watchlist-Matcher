export interface Movie {
  title: string | null;
  letterboxd_url: string | null;
  poster: string | null;
  year: string | null;
  summary: string | null;
}

export interface IntersectResponse {
  users_checked: string[];
  common_count: number;
  common_movies: Movie[];
}

export interface ApiError {
  detail: string;
}
