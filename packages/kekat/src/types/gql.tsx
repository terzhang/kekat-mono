export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  from: Scalars['String'];
  text: Scalars['String'];
  date: Scalars['DateTime'];
  chatroom: Chatroom;
  user: User;
};


export type Chatroom = {
  __typename?: 'Chatroom';
  id: Scalars['ID'];
  name: Scalars['String'];
  users: Array<User>;
  messages: Array<Message>;
  getMessages: Array<Message>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  chatrooms?: Maybe<Array<Chatroom>>;
  messages: Array<Message>;
};

export type MessageInput = {
  chatroomId: Scalars['String'];
  from: Scalars['String'];
  text: Scalars['String'];
};

export type ChangePasswordInput = {
  token: Scalars['String'];
  password: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAllChatrooms: Array<Chatroom>;
  chatroomsOfUser: Array<Chatroom>;
  getMe: User;
};


export type QueryGetAllChatroomsArgs = {
  limit: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  joinChatroom: Chatroom;
  addNewMessage: Scalars['Boolean'];
  createChatroomWithUser?: Maybe<Chatroom>;
  deleteChatroom: Scalars['ID'];
  confirmEmail: Scalars['Boolean'];
  sendConfirmEmail: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword?: Maybe<User>;
  login: Scalars['String'];
  logout: Scalars['Boolean'];
  register: User;
};


export type MutationJoinChatroomArgs = {
  chatroomId: Scalars['String'];
};


export type MutationAddNewMessageArgs = {
  message: MessageInput;
};


export type MutationCreateChatroomWithUserArgs = {
  roomName: Scalars['String'];
};


export type MutationDeleteChatroomArgs = {
  chatroomId: Scalars['String'];
};


export type MutationConfirmEmailArgs = {
  uniqueId: Scalars['String'];
};


export type MutationSendConfirmEmailArgs = {
  email: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
};


export type SubscriptionNewMessageArgs = {
  chatroomId: Scalars['String'];
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = (
  { __typename?: 'Query' }
  & { getMe: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
  ) }
);

export type RegisterMutationVariables = Exact<{
  data: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & Pick<User, 'firstName' | 'lastName' | 'email'>
  ) }
);

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type ConfirmEmailMutationVariables = Exact<{
  uniqueId: Scalars['String'];
}>;


export type ConfirmEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'confirmEmail'>
);

export type SendConfirmEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendConfirmEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendConfirmEmail'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);
