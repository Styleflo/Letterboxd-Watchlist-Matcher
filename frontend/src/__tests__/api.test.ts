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
});
