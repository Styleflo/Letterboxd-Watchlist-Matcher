import { IntersectResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class ApiRequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
  }
}

/**
 * Calls backend API to find the watchlist intersection between specified usernames.
 */
export async function intersectWatchlists(
  usernames: string[],
  signal?: AbortSignal
): Promise<IntersectResponse> {
  const sanitizedUsernames = usernames
    .map((u) => u.trim())
    .filter((u) => u.length > 0);

  if (sanitizedUsernames.length < 2) {
    throw new ApiRequestError('Please provide at least 2 valid Letterboxd usernames.', 400);
  }

  const response = await fetch(`${API_BASE_URL}/api/movies/watchlist/intersect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ usernames: sanitizedUsernames }),
    signal,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Fallback if response is not json
    }
    throw new ApiRequestError(errorMessage, response.status);
  }

  const data: IntersectResponse = await response.json();
  return data;
}
