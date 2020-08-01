import { DocumentNode } from 'graphql';
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { CombinedError } from 'urql';
import { client } from '../API/client';
import {
  CONFIRM_EMAIL_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  REGISTER_MUTATION,
  SEND_CONFIRM_EMAIL_MUTATION,
} from '../API/home';

import {
  ConfirmEmailMutationVariables,
  ForgotPasswordMutationVariables,
  GetMeQuery,
  LoginInput,
  LoginMutation,
  LoginMutationVariables,
  LogoutMutation,
  MutationConfirmEmailArgs,
  MutationForgotPasswordArgs,
  MutationSendConfirmEmailArgs,
  RegisterInput,
  RegisterMutation,
  RegisterMutationVariables,
  User as UserData,
} from '../types/gql';

import { EditableUserData, VisibleUserData } from '../types/user';

interface RequestActionProps {
  gql: string | DocumentNode;
  variables?: any;
  errorMsg?: string;
  callback?: (data: any, error?: CombinedError | undefined) => void;
}
type mutation = (props: RequestActionProps) => Promise<Error | undefined>;
type query = mutation;
const mutation: mutation = async ({ gql, variables, errorMsg, callback }) => {
  const { data, error } = await client.mutation(gql, variables).toPromise();
  if (error) return new Error(errorMsg);
  if (callback) callback(data, error);
  return;
};

const query: query = async ({ gql, variables, errorMsg, callback }) => {
  const { data, error } = await client.query(gql, variables).toPromise();
  if (error) return new Error(errorMsg);
  if (callback) callback(data, error);
  return;
};

/* type MutationReturn<M> = {
  [name in keyof Mutation]: Partial<M>;
};

type QueryReturn<Q> = {
  [name in keyof Query]: Partial<Q>;
}; */

const userActions = () => {
  const [userData, setUserData] = useState<VisibleUserData>({
    firstName: null,
    lastName: null,
    email: null,
  });

  /** as long as the new data is a type of userData
   * this will safely update userData without deleting anything
   */
  const safeSetUserData = (newData: Partial<UserData>) => {
    setUserData({ ...userData, ...newData });
  };

  /** replace local user data with database's */
  const loadMe = () =>
    query({
      gql: ME_QUERY,
      errorMsg: 'Your login session has expired',
      callback: ({ getMe: data }: GetMeQuery) => safeSetUserData(data),
    });

  /** make new user in database */
  const createMe = (data: RegisterInput) =>
    mutation({
      gql: REGISTER_MUTATION,
      variables: { data } as RegisterMutationVariables,
      errorMsg: 'Cannot register at this moment',
      callback: ({ register }: RegisterMutation) => safeSetUserData(register),
    });

  /** update user data in database
   * TODO: not yet implemented
   */
  const changeMe = async (data: EditableUserData): Promise<void | Error> => {
    // update user profile in database
    // then update userData locally when that succeeds
    safeSetUserData(data);
  };

  /* const login = async (data: LoginFormInputs): Promise<any | Error> => {
    const { data: returnedData, error } = await client
      .mutation(LOGIN_MUTATION, { data })
      .toPromise();
    if (error) return new Error('Unable to login at this moment');
    const secondHalfToken = returnedData['login'];
    // TODO: Switch from localStorage to memory store
    localStorage.setItem('secondHalfToken', secondHalfToken);
  }; */

  /** attempt to login */
  const login = (data: LoginInput) =>
    mutation({
      gql: LOGIN_MUTATION,
      variables: { data } as LoginMutationVariables,
      errorMsg: 'Incorrect login information.',
      // successful login -> store half token in local storage
      callback: ({ login: secondHalfToken }: LoginMutation) => {
        localStorage.setItem('secondHalfToken', secondHalfToken);
      },
    });

  /** logout and remove all session credentials */
  const logout = () =>
    mutation({
      gql: LOGOUT_MUTATION,
      errorMsg: 'Something went wrong. Try logging out again.',
      // successful logout -> remove half token in local storage
      callback: ({ logout }: LogoutMutation) => {
        if (logout) localStorage.removeItem('secondHalfToken');
      },
    });

  /** confirm email via token */
  const confirmEmail = (token: MutationConfirmEmailArgs['uniqueId']) =>
    mutation({
      gql: CONFIRM_EMAIL_MUTATION,
      variables: { uniqueId: token } as ConfirmEmailMutationVariables,
      errorMsg:
        'Failed to confirm email. The confirmation link may have expired.',
    });

  /** send a new confirmation email to an email */
  const sendConfirmEmail = (email: MutationSendConfirmEmailArgs['email']) =>
    mutation({
      gql: SEND_CONFIRM_EMAIL_MUTATION,
      variables: { email },
      errorMsg: 'Server is experiencing issues. Please try this again later.',
    });

  /** send confirmation to user's email (if valid user) to reset password  */
  const forgotPassword = (email: MutationForgotPasswordArgs['email']) =>
    mutation({
      gql: FORGOT_PASSWORD_MUTATION,
      variables: { email } as ForgotPasswordMutationVariables,
      errorMsg: '',
    });

  return {
    userData,
    loadMe,
    createMe,
    confirmEmail,
    changeMe,
    login,
    logout,
    sendConfirmEmail,
    forgotPassword,
  };
};

export const User = createContainer(userActions);
