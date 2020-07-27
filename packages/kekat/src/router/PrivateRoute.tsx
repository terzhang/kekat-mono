import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

/** higher order comp that redirect any access to its children
 *  to /login if not authenticated
 */
export const PrivateRoute: FC<Props> = ({ children }) => {
  return (
    <Route
      render={() =>
        localStorage.getItem('secondHalfToken') ? (
          children
        ) : (
          <Redirect
            exact
            to={{
              pathname: '/login',
            }}
          />
        )
      }
    />
  );
};
