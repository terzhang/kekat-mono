import React, { FC, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { User } from '../containers/User';

import { useForm } from 'react-hook-form';
import { Input } from '../comps/Form';

type EmailFormProps = {
  submitCallback: (data: EmailFormInput) => void;
};

type EmailFormInput = {
  email: string;
};

const EmailForm: FC<EmailFormProps> = ({ submitCallback }) => {
  const { register, handleSubmit, errors } = useForm<EmailFormInput>();
  const onSubmit = (data: EmailFormInput) => {
    submitCallback(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name='email'
        label='Email'
        error={errors['email']}
        ref={register({ required: true, max: 30, min: 6 })}
      />
      <input type='submit' />
    </form>
  );
};

export type ConfirmEmailQueries = {
  token: string;
};

export const ConfirmEmail = () => {
  const [error, setError] = useState<null | Error>(null);
  const [showEmailForm, setEmailForm] = useState<boolean>(false);
  const history = useHistory();
  const user = User.useContainer();
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    // token should come from the query parameter, token.
    // example.com/confirm?token=...
    const token = query.get('token');
    if (token && !error) {
      user.confirmEmail(token).then((error) => {
        if (error) setError(error);
      });
    } else {
      setError(new Error('Confirmation link is invalid'));
    }
  }, []);

  const openEmailForm = () => {
    setEmailForm(true);
  };

  const onEmailSubmit = async (data: EmailFormInput) => {
    const error = await user.sendConfirmEmail(data.email);
    if (error) setError(error);
  };

  if (!error) {
    setTimeout(() => history.replace('/login'), 5000);
    return <div>Email confirmed! Nice.</div>;
  }

  return (
    <div>
      {error ? <p>{error.message}</p> : null}
      <button onClick={openEmailForm}>Resend Confirmation Email</button>
      {showEmailForm ? <EmailForm submitCallback={onEmailSubmit} /> : null}
    </div>
  );
};
