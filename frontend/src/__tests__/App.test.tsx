import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../App';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  intersectWatchlists: vi.fn(),
  ApiRequestError: class ApiRequestError extends Error {
    status: number;
    code?: string;
    notFoundUsers: string[];
    privateUsers: string[];
    details?: unknown;
    constructor(
      message: string,
      status: number,
      code?: string,
      notFoundUsers: string[] = [],
      privateUsers: string[] = [],
      details?: unknown
    ) {
      super(message);
      this.name = 'ApiRequestError';
      this.status = status;
      this.code = code;
      this.notFoundUsers = notFoundUsers;
      this.privateUsers = privateUsers;
      this.details = details;
    }
  },
}));

describe('App - User Not Found & State Lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays not-found alert in red theme when partial users succeed', async () => {
    const user = userEvent.setup();
    vi.mocked(api.intersectWatchlists).mockResolvedValue({
      total_movies_found: 1,
      total_users: 2,
      users_checked: ['alice', 'bob'],
      movies: {
        '2': {
          label: 'Shared by 2 users',
          count: 1,
          movies: [
            {
              title: 'Inception',
              year: '2010',
              letterboxd_url: 'https://letterboxd.com/film/inception/',
              poster: 'https://example.com/poster.jpg',
              summary: 'A thief steals corporate secrets...',
            },
          ],
        },
      },
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    const addBtn = screen.getByRole('button', { name: /Add User/i });

    await user.type(input, 'alice');
    await user.click(addBtn);
    await user.type(input, 'bob');
    await user.click(addBtn);
    await user.type(input, 'charlie_invalid');
    await user.click(addBtn);

    const submitBtn = screen.getByRole('button', { name: /Find Common Movies/i });
    await user.click(submitBtn);

    // Wait for result
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    const alert = screen.getByRole('alert');
    // Ensure red theme classes are used on the alert container
    expect(alert.className).toContain('border-red-800/60');
    expect(screen.getByText('Letterboxd account not found')).toBeInTheDocument();
    expect(screen.getByText('@charlie_invalid')).toBeInTheDocument();
    expect(screen.getAllByText('Inception')[0]).toBeInTheDocument();
  });

  it('clears the red mark immediately when editing a not-found user', async () => {
    const user = userEvent.setup();
    vi.mocked(api.intersectWatchlists).mockResolvedValue({
      total_movies_found: 0,
      total_users: 2,
      users_checked: ['alice', 'bob'],
      movies: {},
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    const addBtn = screen.getByRole('button', { name: /Add User/i });

    await user.type(input, 'alice');
    await user.click(addBtn);
    await user.type(input, 'bob');
    await user.click(addBtn);
    await user.type(input, 'charlie_typo');
    await user.click(addBtn);

    await user.click(screen.getByRole('button', { name: /Find Common Movies/i }));

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });

    // Edit charlie_typo to charlie_fixed
    const editBtn = screen.getByRole('button', { name: /Edit username charlie_typo/i });
    await user.click(editBtn);

    const editInput = screen.getByDisplayValue('charlie_typo');
    await user.clear(editInput);
    await user.type(editInput, 'charlie_fixed');
    await user.click(screen.getByRole('button', { name: /Save username/i }));

    // Red mark must disappear
    expect(screen.queryByText('Not found')).not.toBeInTheDocument();
    // Alert should also be removed since it was the only not-found user
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the red mark and warning banner if editing a user without changing the username', async () => {
    const user = userEvent.setup();
    vi.mocked(api.intersectWatchlists).mockResolvedValue({
      total_movies_found: 0,
      total_users: 2,
      users_checked: ['alice', 'bob'],
      movies: {},
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    const addBtn = screen.getByRole('button', { name: /Add User/i });

    await user.type(input, 'alice');
    await user.click(addBtn);
    await user.type(input, 'bob');
    await user.click(addBtn);
    await user.type(input, 'charlie_typo');
    await user.click(addBtn);

    await user.click(screen.getByRole('button', { name: /Find Common Movies/i }));

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Click edit on charlie_typo and save without modifying
    const editBtn = screen.getByRole('button', { name: /Edit username charlie_typo/i });
    await user.click(editBtn);

    await user.click(screen.getByRole('button', { name: /Save username/i }));

    // Red mark and warning alert must STILL be present
    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('@charlie_typo')).toBeInTheDocument();
  });

  it('updates the alert and only removes it when the last not-found user is edited or removed', async () => {
    const user = userEvent.setup();
    vi.mocked(api.intersectWatchlists).mockResolvedValue({
      total_movies_found: 0,
      total_users: 2,
      users_checked: ['alice', 'bob'],
      movies: {},
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    const addBtn = screen.getByRole('button', { name: /Add User/i });

    await user.type(input, 'alice');
    await user.click(addBtn);
    await user.type(input, 'bob');
    await user.click(addBtn);
    await user.type(input, 'ghost1');
    await user.click(addBtn);
    await user.type(input, 'ghost2');
    await user.click(addBtn);

    await user.click(screen.getByRole('button', { name: /Find Common Movies/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Both ghost1 and ghost2 are shown
    expect(screen.getByText('@ghost1')).toBeInTheDocument();
    expect(screen.getByText('@ghost2')).toBeInTheDocument();

    // Remove ghost1
    const removeGhost1Btn = screen.getByRole('button', { name: /Remove user ghost1/i });
    await user.click(removeGhost1Btn);

    // Alert should STILL be present because ghost2 is still not found
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('@ghost1')).not.toBeInTheDocument();
    expect(screen.getByText('@ghost2')).toBeInTheDocument();

    // Now remove ghost2 (last not-found user)
    const removeGhost2Btn = screen.getByRole('button', { name: /Remove user ghost2/i });
    await user.click(removeGhost2Btn);

    // Alert should now be gone
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText('Not found')).not.toBeInTheDocument();
  });

  it('does not mark a newly added user as not found after removing previous not-found users', async () => {
    const user = userEvent.setup();
    vi.mocked(api.intersectWatchlists).mockResolvedValue({
      total_movies_found: 0,
      total_users: 2,
      users_checked: ['alice', 'bob'],
      movies: {},
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    const addBtn = screen.getByRole('button', { name: /Add User/i });

    await user.type(input, 'alice');
    await user.click(addBtn);
    await user.type(input, 'bob');
    await user.click(addBtn);
    await user.type(input, 'typo_user');
    await user.click(addBtn);

    await user.click(screen.getByRole('button', { name: /Find Common Movies/i }));

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });

    // Remove the not-found user
    const removeTypoBtn = screen.getByRole('button', { name: /Remove user typo_user/i });
    await user.click(removeTypoBtn);

    expect(screen.queryByText('Not found')).not.toBeInTheDocument();

    // Add a brand new user
    await user.type(input, 'brand_new_user');
    await user.click(addBtn);

    // brand_new_user must NOT be marked as not found
    expect(screen.getByText('brand_new_user')).toBeInTheDocument();
    expect(screen.queryByText('Not found')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
