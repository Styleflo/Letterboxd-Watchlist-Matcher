import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorMessage } from '../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('displays the exact error message returned by the API', () => {
    const apiError =
      'An error occurred while fetching Letterboxd data: User @alice has an empty watchlist.';

    render(<ErrorMessage message={apiError} />);

    expect(screen.getByText(apiError)).toBeInTheDocument();
  });

  it('displays custom account verification error returned by the API without overriding it', () => {
    const customApiError =
      'You need at least two users that have a letterboxd account.';

    render(<ErrorMessage message={customApiError} />);

    expect(screen.getByText(customApiError)).toBeInTheDocument();
  });

  it('triggers onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(<ErrorMessage message="Something failed" onRetry={handleRetry} />);

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    await user.click(retryBtn);

    expect(handleRetry).toHaveBeenCalled();
  });
});
