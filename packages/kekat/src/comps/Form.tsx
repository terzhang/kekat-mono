import { yupResolver } from '@hookform/resolvers';
import React, { forwardRef, ReactNode, RefObject } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { string, object } from 'yup';

interface InputProps {
  /** The variable name for this input */
  name: string;
  /** The name that will be display on the UI */
  label: string;
  /** Can optionally provide a render prop to show as label */
  labelRender?: ReactNode | undefined;
  /** The Error object for this field */
  error: FieldError | undefined;
}

/** An input wrapper that handles error and take refs
 * also forwards its ref to the inner input component
 * note that this means the component will receive "ref" as a second argument
 */
export const Input = forwardRef(
  ({ name, label, labelRender, error, ...props }: InputProps, ref) => {
    return (
      <div>
        {/* conditionally render label if provider, else just put label */}
        {labelRender ? { labelRender } : <label htmlFor={name}>{label}</label>}
        <input
          name={name}
          ref={ref as RefObject<HTMLInputElement>}
          {...props}
        />
        {/* https://react-hook-form.com/api/#ErrorMessage */}
        {error && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{error.message}</p>
        )}
      </div>
    );
  }
);

// https://github.com/jquense/yup
const RegisterFormSchema = object().shape({
  firstName: string().required('First name is required.'),
  lastName: string().required('Last name is required.'),
  email: string()
    .email('Email must be valid.')
    .required('An email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters.')
    .max(30, 'Password cannot be this long.')
    .required('Please enter a password'),
});

export interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  /** default values for each input in form */
  defaultValues?: Partial<RegisterFormInputs>;
  /** the callback to call with the inputted data */
  submitCallback: (data: RegisterFormInputs) => void;
}

export function RegisterForm({
  submitCallback,
  defaultValues,
}: RegisterFormProps) {
  // useForm options: https://react-hook-form.com/api#useForm
  const { register, handleSubmit, reset, errors } = useForm<RegisterFormInputs>(
    {
      mode: 'onBlur',
      reValidateMode: 'onChange',
      resolver: yupResolver(RegisterFormSchema),
      defaultValues,
    }
  );

  /** https://react-hook-form.com/api/#handleSubmit */
  const onSubmit = (
    data: RegisterFormInputs,
    event: React.BaseSyntheticEvent | undefined
  ) => {
    event?.preventDefault(); // prevent default submit action
    event?.target.reset(); // reset form after submit
    submitCallback(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ margin: '1rem' }}>
      <Input
        label={'First Name'}
        name={'firstName'}
        ref={register}
        error={errors['firstName']}
      />
      <Input
        label={'Last Name'}
        name={'lastName'}
        ref={register}
        error={errors['lastName']}
      />
      <Input
        label={'Email'}
        name={'email'}
        ref={register}
        error={errors['email']}
      />
      <Input
        label={'Password'}
        name={'password'}
        ref={register}
        error={errors['password']}
      />
      <input
        type='reset'
        onClick={() => reset({})}
        value='Reset fields'
      ></input>
      <input type='submit' value='Submit' />
    </form>
  );
}

const LoginFormSchema = object().shape({
  email: string()
    .email('Email must be valid.')
    .required('An email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters.')
    .max(30, 'Password cannot be this long.')
    .required('Please enter a password'),
});

export interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginFormProps {
  /** default values for each input in form */
  defaultValues?: Partial<LoginFormInputs>;
  /** the callback to call with the inputted data */
  submitCallback: (data: LoginFormInputs) => void;
}

export function LoginForm({ submitCallback, defaultValues }: LoginFormProps) {
  const { register, handleSubmit, reset, errors } = useForm<LoginFormInputs>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(LoginFormSchema),
    defaultValues,
  });

  const onSubmit = (
    data: LoginFormInputs,
    event: React.BaseSyntheticEvent | undefined
  ) => {
    event?.preventDefault(); // prevent default submit action
    event?.target.reset(); // reset form after submit
    submitCallback(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ margin: '1rem' }}>
      <Input
        label={'Email'}
        name={'email'}
        ref={register}
        error={errors['email']}
      />
      <Input
        label={'Password'}
        name={'password'}
        ref={register}
        error={errors['password']}
      />
      <input
        type='reset'
        onClick={() => reset({})}
        value='Reset fields'
      ></input>
      <input type='submit' value='Submit' />
    </form>
  );
}
