import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserGroupManager } from '../components/UserGroupManager';

describe('UserGroupManager', () => {
  it('renders correctly with empty list and disables submit button', () => {
    render(
      <UserGroupManager
        users={[]}
        onAddUser={vi.fn()}
        onEditUser={vi.fn()}
        onRemoveUser={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText(/No users added yet/i)).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /Find Common Movies/i });
    expect(submitBtn).toBeDisabled();
  });

  it('calls onAddUser when entering a valid username', async () => {
    const user = userEvent.setup();
    const handleAddUser = vi.fn();

    render(
      <UserGroupManager
        users={[]}
        onAddUser={handleAddUser}
        onEditUser={vi.fn()}
        onRemoveUser={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    await user.type(input, 'cinema_fan');
    await user.click(screen.getByRole('button', { name: /Add User/i }));

    expect(handleAddUser).toHaveBeenCalledWith('cinema_fan');
  });

  it('validates against duplicate usernames', async () => {
    const user = userEvent.setup();
    const handleAddUser = vi.fn();

    render(
      <UserGroupManager
        users={['filmfan']}
        onAddUser={handleAddUser}
        onEditUser={vi.fn()}
        onRemoveUser={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\. dave/i);
    await user.type(input, 'FILMFAN');
    await user.click(screen.getByRole('button', { name: /Add User/i }));

    expect(handleAddUser).not.toHaveBeenCalled();
    expect(screen.getByText(/User "filmfan" is already in the list/i)).toBeInTheDocument();
  });

  it('allows removing a user', async () => {
    const user = userEvent.setup();
    const handleRemoveUser = vi.fn();

    render(
      <UserGroupManager
        users={['user1', 'user2']}
        onAddUser={vi.fn()}
        onEditUser={vi.fn()}
        onRemoveUser={handleRemoveUser}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    const removeBtn = screen.getByRole('button', { name: /Remove user user1/i });
    await user.click(removeBtn);

    expect(handleRemoveUser).toHaveBeenCalledWith(0);
  });

  it('enables submit button when 2 or more users are added and triggers onSubmit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <UserGroupManager
        users={['user1', 'user2']}
        onAddUser={vi.fn()}
        onEditUser={vi.fn()}
        onRemoveUser={vi.fn()}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Find Common Movies/i });
    expect(submitBtn).not.toBeDisabled();

    await user.click(submitBtn);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('renders "Not found" badge for users present in notFoundUsers', () => {
    render(
      <UserGroupManager
        users={['alice', 'fake_bob']}
        notFoundUsers={['fake_bob']}
        onAddUser={vi.fn()}
        onEditUser={vi.fn()}
        onRemoveUser={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText('Not found')).toBeInTheDocument();
    expect(screen.getByTitle(/This account was not found on Letterboxd/i)).toBeInTheDocument();
  });
});
