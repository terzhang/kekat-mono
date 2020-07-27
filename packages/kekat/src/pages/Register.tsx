import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RegisterForm, RegisterFormInputs } from '../comps/Form';
import { User } from '../containers/User';

export const Register = () => {
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const user = User.useContainer();
  const history = useHistory();
  const onRegister = async (data: RegisterFormInputs) => {
    const error = await user.createMe(data);
    if (error) setError(error);
    else {
      setSuccess(true);
      setTimeout(() => history.push('/'), 10000);
    }
  };

  if (error) return <div>{error?.message}</div>;
  else if (success) return <div>A confirmation email has been sent.</div>;
  return (
    <div>
      <RegisterForm submitCallback={onRegister} />
      <Link to={'/login'}>Already have an account? Sign in!</Link>
    </div>
  );
};
