import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { intersectWatchlists, ApiRequestError } from '../services/api';

describe('intersectWatchlists API service', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('throws ApiRequestError when fewer than 2 valid usernames are provided', async () => {
    await expect(intersectWatchlists(['user1'])).rejects.toThrow(ApiRequestError);
    await expect(intersectWatchlists(['', '  '])).rejects.toThrow(
      'Please provide at least 2 valid Letterboxd usernames.'
    );
  });

  it('sends POST request with sanitized usernames and returns tiered data on success', async () => {
    const mockResponse = {
      users_checked: ['alice', 'bob'],
      total_users: 2,
      total_movies_found: 1,
      movies: {
        '2': {
          label: 'Shared by 2/2 users',
          count: 1,
          movies: [
            {
              title: 'Whiplash',
              year: '2014',
              letterboxd_url: 'https://letterboxd.com/film/whiplash-2014/',
              poster: 'https://example.com/whiplash.jpg',
              summary: 'A promising young drummer enrolls at a cut-throat music conservatory.',
            },
          ],
        },
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await intersectWatchlists([' alice ', 'bob ']);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/movies/watchlist/intersect',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ usernames: ['alice', 'bob'] }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('handles backend error response properly', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({
        detail: 'An error occurred while fetching Letterboxd data: User not found',
      }),
    } as unknown as Response);

    await expect(intersectWatchlists(['alice', 'bob'])).rejects.toThrow(
      'An error occurred while fetching Letterboxd data: User not found'
    );
  });

  it('extracts structured USER_VALIDATION_ERROR fields properly', async () => {
    const errorPayload = {
      detail: {
        code: 'USER_VALIDATION_ERROR',
        message: 'The following username(s) could not be found: ghost.',
        not_found: ['ghost'],
        private: ['secret_user'],
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue(errorPayload),
    } as unknown as Response);

    try {
      await intersectWatchlists(['ghost', 'secret_user']);
      expect.unreachable('Should have thrown an error');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiRequestError);
      const apiErr = err as ApiRequestError;
      expect(apiErr.statusCode).toBe(422);
      expect(apiErr.code).toBe('USER_VALIDATION_ERROR');
      expect(apiErr.message).toBe(
        'The following username(s) could not be found: ghost.'
      );
      expect(apiErr.notFoundUsers).toEqual(['ghost']);
      expect(apiErr.privateUsers).toEqual(['secret_user']);
    }
  });
});
