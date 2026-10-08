import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorModal } from '../components/ErrorModal';
import { ErrorState } from '../types';

describe('ErrorModal', () => {
  it('does not render when error is null', () => {
    const { container } = render(<ErrorModal error={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders generic error message and title', () => {
    const error: ErrorState = {
      message: 'Failed to contact Letterboxd servers.',
    };

    render(<ErrorModal error={error} onClose={vi.fn()} />);

    expect(screen.getByText('Unable to Fetch Common Watchlists')).toBeInTheDocument();
    expect(screen.getByText('Failed to contact Letterboxd servers.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Close$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close dialog/i })).toBeInTheDocument();
  });

  it('renders USER_VALIDATION_ERROR with marked users for not_found and private', () => {
    const error: ErrorState = {
      message: 'User validation failed. Check usernames below.',
      code: 'USER_VALIDATION_ERROR',
      notFoundUsers: ['fake_user'],
      privateUsers: ['hidden_user'],
    };

    render(<ErrorModal error={error} onClose={vi.fn()} />);

    expect(screen.getByText('User Verification Failed')).toBeInTheDocument();
    expect(screen.getByText('User validation failed. Check usernames below.')).toBeInTheDocument();
    expect(screen.getByText('@fake_user')).toBeInTheDocument();
    expect(screen.getByText('(Not found)')).toBeInTheDocument();
    expect(screen.getByText('@hidden_user')).toBeInTheDocument();
    expect(screen.getByText('(Private)')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const error: ErrorState = { message: 'Some error' };

    render(<ErrorModal error={error} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when the bottom Close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const error: ErrorState = { message: 'Some error' };

    render(<ErrorModal error={error} onClose={handleClose} />);

    const bottomCloseBtn = screen.getByRole('button', { name: /^Close$/i });
    await user.click(bottomCloseBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});
