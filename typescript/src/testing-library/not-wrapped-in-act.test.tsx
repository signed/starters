import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
// https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning

type UsernameFormState = { status: 'idle' | 'pending' | 'fullfilled' | 'rejected', error: null | any };

const UsernameForm = ({ updateUsername }) => {
  const [{ status, error }, setState] = React.useState<UsernameFormState>({
    status: 'idle',
    error: null
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const newUsername = event.target.elements.username.value;
    setState((state) => ({ ...state, status: 'pending' }));
    try {
      await updateUsername(newUsername);
      setState((state) => ({ ...state, status: 'fullfilled' }));
    } catch (e) {
      setState((state) => ({ ...state, status: 'rejected', error: e }));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input id="username"/>
      <button type="submit">Submit</button>
      <span>{status === 'pending' ? 'Saving...' : null}</span>
      <span>{status === 'rejected' ? error.message : null}</span>
    </form>
  );
};

test('calls updateUsername with the new username', async () => {
  const handleUpdateUsername = jest.fn();
  const fakeUsername = 'sonicthehedgehog';
  render(<UsernameForm updateUsername={handleUpdateUsername}/>);
  const usernameInput = screen.getByLabelText(/username/i);
  await user.type(usernameInput, fakeUsername);
  user.click(screen.getByText(/submit/i));
  expect(handleUpdateUsername).toHaveBeenCalledWith(fakeUsername);
});