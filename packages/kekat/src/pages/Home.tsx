import React, { FC, HTMLAttributes, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { User } from '../containers/User';
import { VisibleUserData } from '../types/user';

interface Props {
  userData: VisibleUserData;
}

/** Display the logged in user's information */
const UserInfoPanel: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  userData,
  ...rest
}) => {
  return (
    <div {...rest}>
      <p>Name: {userData.firstName + ' ' + userData.lastName}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};

/** The home page at /home */
export const Home = () => {
  const [error, setError] = useState<Error | null>(null);
  const user = User.useContainer();
  const fetchUserData = async () => {
    const error = await user.loadMe();
    if (error) setError(error);
  };

  /** goal here is to fetch user data once on mount
   * But store it and don't fetch it everytime
   */
  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) {
    // if there's an error getting user info
    // unAuthorize user removing the second half jwt in storage
    localStorage.removeItem('secondHalfToken');
    return <Redirect to='/login' />;
  }
  return (
    <main className='home-container'>
      <UserInfoPanel userData={user.userData} className={'info-panel'} />
    </main>
  );
};
