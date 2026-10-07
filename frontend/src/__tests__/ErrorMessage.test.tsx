import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorMessage } from '../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('displays the friendly tip when error is about letterboxd accounts', () => {
    render(
      <ErrorMessage
        message="An error occurred while fetching Letterboxd data: You need at least two users that have a letterboxd account."
      />
    );

    expect(
      screen.getByText(
        'One or more usernames could not be verified on Letterboxd. Please check for typos or ensure their accounts are public.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/An error occurred while fetching Letterboxd data/i)
    ).not.toBeInTheDocument();
  });

  it('displays the raw message when it is a generic error', () => {
    render(<ErrorMessage message="Network connection lost. Please check your internet." />);

    expect(
      screen.getByText('Network connection lost. Please check your internet.')
    ).toBeInTheDocument();
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
