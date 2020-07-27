import React, { useState } from 'react';
import {
  Link /* Redirect  , useHistory */,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { LoginForm, LoginFormInputs } from '../comps/Form';
import { User } from '../containers/User';
import '../css/login.css';
import Blob from '../assets/svg/blob';

type LocationState = {
  from?: string;
};

export const Login = () => {
  const [error, setError] = useState<Error | null>(null);
  const user = User.useContainer();
  const history = useHistory();
  const { state } = useLocation<LocationState>();
  const onLogin = async (data: LoginFormInputs) => {
    const error = await user.login(data);
    if (error?.message) setError(error);
    // go to home page
    else history.push('/');
  };

  if (error) return <div>{error?.message}</div>;

  return (
    <main className='login-container'>
      <Blob className='blob' fill='cornflowerblue' />
      <div className='login-form'>
        {state?.from === 'logout' ? <p>You have logged out.</p> : null}
        <LoginForm submitCallback={onLogin} />
        <Link to={'/register'}>Create a account</Link>
        <br />
        <Link to={'/forgot'}>Forgot Password</Link>
      </div>
    </main>
  );
};
