import { RegisterFormInputs } from '../comps/Form';
import { User } from './gql';

export type UserData = User;

/** data related to user not provided by User */
export type GeneratedUserData = { id: string };

/** User data that's not to be known */
export type NonVisibleUserData = 'id';

/** all the user data can be optionally visible except id */
export type VisibleUserData = Partial<
  Omit<NullableData<UserData>, NonVisibleUserData>
>;

/** everything except generated data is edittable for now */
export type EditableUserData = RegisterFormInputs;
