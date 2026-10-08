import { IntersectResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class ApiRequestError extends Error {
  statusCode: number;
  code?: string;
  notFoundUsers: string[];
  privateUsers: string[];

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    notFoundUsers: string[] = [],
    privateUsers: string[] = []
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.code = code;
    this.notFoundUsers = notFoundUsers;
    this.privateUsers = privateUsers;
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
    let errorCode: string | undefined;
    let notFoundUsers: string[] = [];
    let privateUsers: string[] = [];

    try {
      const errorData = await response.json();
      const detail = errorData?.detail;

      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (detail && typeof detail === 'object') {
        if (Array.isArray(detail)) {
          errorMessage = detail
            .map((item: { msg?: string }) => item.msg || JSON.stringify(item))
            .join('; ');
        } else {
          errorMessage = detail.message || errorMessage;
          errorCode = detail.code;
          if (Array.isArray(detail.not_found)) {
            notFoundUsers = detail.not_found;
          }
          if (Array.isArray(detail.private)) {
            privateUsers = detail.private;
          }
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Fallback if response is not json
    }

    throw new ApiRequestError(
      errorMessage,
      response.status,
      errorCode,
      notFoundUsers,
      privateUsers
    );
  }

  const data: IntersectResponse = await response.json();
  return data;
}
