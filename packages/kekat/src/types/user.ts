import { RegisterFormInputs } from '../comps/Form';
import { User } from './gql';

export type UserData = User;

type Nullable<T> = T | undefined | null;

/** data related to user not provided by User */
export type GeneratedUserData = { id: string };

/** user provided & generated data except password */
// export type UserData = Omit<RegisterFormInputs, 'password'> & GeneratedUserData;

/** user data but each of its property is nullable & can be undefined */
// (ie union null, undefined to each properties)
export type NullableUserData = {
  [K in keyof User]: Nullable<User[K]>;
};

/** User data that's not to be known */
export type NonVisibleUserData = 'id';

/** all the user data can be optionally visible except id */
export type VisibleUserData = Partial<
  Omit<NullableUserData, NonVisibleUserData>
>;

/** everything except generated data is edittable for now */
export type EditableUserData = RegisterFormInputs;
