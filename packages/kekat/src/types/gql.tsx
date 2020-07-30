import { GraphQLResolveInfo } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Chatroom = {
  __typename?: 'Chatroom';
  id: Scalars['ID'];
  name: Scalars['String'];
  users: Array<User>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  chatrooms?: Maybe<Array<Chatroom>>;
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




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Chatroom: ResolverTypeWrapper<Chatroom>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  ChangePasswordInput: ChangePasswordInput;
  LoginInput: LoginInput;
  RegisterInput: RegisterInput;
  Query: ResolverTypeWrapper<{}>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Chatroom: Chatroom;
  ID: Scalars['ID'];
  String: Scalars['String'];
  User: User;
  ChangePasswordInput: ChangePasswordInput;
  LoginInput: LoginInput;
  RegisterInput: RegisterInput;
  Query: {};
  Float: Scalars['Float'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
};

export type ChatroomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Chatroom'] = ResolversParentTypes['Chatroom']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chatrooms?: Resolver<Maybe<Array<ResolversTypes['Chatroom']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllChatrooms?: Resolver<Array<ResolversTypes['Chatroom']>, ParentType, ContextType, RequireFields<QueryGetAllChatroomsArgs, 'limit'>>;
  chatroomsOfUser?: Resolver<Array<ResolversTypes['Chatroom']>, ParentType, ContextType>;
  getMe?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  joinChatroom?: Resolver<ResolversTypes['Chatroom'], ParentType, ContextType, RequireFields<MutationJoinChatroomArgs, 'chatroomId'>>;
  createChatroomWithUser?: Resolver<Maybe<ResolversTypes['Chatroom']>, ParentType, ContextType, RequireFields<MutationCreateChatroomWithUserArgs, 'roomName'>>;
  deleteChatroom?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteChatroomArgs, 'chatroomId'>>;
  confirmEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationConfirmEmailArgs, 'uniqueId'>>;
  sendConfirmEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendConfirmEmailArgs, 'email'>>;
  forgotPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  changePassword?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'data'>>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'data'>>;
};

export type Resolvers<ContextType = any> = {
  Chatroom?: ChatroomResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

