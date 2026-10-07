import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserNotFoundAlert } from '../components/UserNotFoundAlert';

describe('UserNotFoundAlert', () => {
  it('does not render when notFoundUsers is empty', () => {
    const { container } = render(
      <UserNotFoundAlert notFoundUsers={[]} onRemoveNotFound={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders singular missing user warning correctly', () => {
    render(
      <UserNotFoundAlert
        notFoundUsers={['ghost_user']}
        onRemoveNotFound={vi.fn()}
      />
    );

    expect(screen.getByText('Letterboxd account not found')).toBeInTheDocument();
    expect(screen.getByText('@ghost_user')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove this user/i })).toBeInTheDocument();
  });

  it('renders plural missing users warning correctly', () => {
    render(
      <UserNotFoundAlert
        notFoundUsers={['fake_one', 'fake_two']}
        onRemoveNotFound={vi.fn()}
      />
    );

    expect(screen.getByText('Letterboxd accounts not found')).toBeInTheDocument();
    expect(screen.getByText('@fake_one')).toBeInTheDocument();
    expect(screen.getByText('@fake_two')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove these users/i })).toBeInTheDocument();
  });

  it('calls onRemoveNotFound with missing users when remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <UserNotFoundAlert
        notFoundUsers={['invalid1', 'invalid2']}
        onRemoveNotFound={handleRemove}
      />
    );

    const removeBtn = screen.getByRole('button', { name: /Remove these users/i });
    await user.click(removeBtn);

    expect(handleRemove).toHaveBeenCalledWith(['invalid1', 'invalid2']);
  });

  it('calls onDismiss when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();

    render(
      <UserNotFoundAlert
        notFoundUsers={['ghost_user']}
        onRemoveNotFound={vi.fn()}
        onDismiss={handleDismiss}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /Dismiss alert/i });
    await user.click(closeBtn);

    expect(handleDismiss).toHaveBeenCalled();
  });
});
