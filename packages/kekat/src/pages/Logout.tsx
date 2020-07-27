import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { User } from '../containers/User';

export const Logout = () => {
  const [error, setError] = useState<null | Error>(null);
  const user = User.useContainer();
  useEffect(() => {
    user.logout().then((error) => {
      if (error) setError(error);
    });
  }, []);

  const handleRetryLogout = () => {
    const error = user.logout();
    // onSuccess clear error
    if (!error) setError(null);
  };

  if (!error) {
    return (
      <Redirect
        push={false}
        to={{
          // not camelCase for some reason
          pathname: '/login',
          // attach query param to '/login' -> '/login?from=logout
          search: '?from=logout',
          // apply router state
          state: { from: 'logout' },
        }}
      />
    );
  }

  return (
    <div>
      <p>{error?.message}</p>
      <button onSubmit={handleRetryLogout}>Try log out again?</button>
    </div>
  );
};
