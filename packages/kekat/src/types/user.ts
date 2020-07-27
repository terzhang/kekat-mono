import { RegisterFormInputs } from '../comps/Form';
type Nullable<T> = T | undefined | null;

/** data related to user not provided by User */
export type GeneratedUserData = { id: string };
/** user provided & generated data except password */
export type UserData = Omit<RegisterFormInputs, 'password'> & GeneratedUserData;
/** user data but each of its property is nullable & can be undefined */
// (ie union null, undefined to each properties)
export type NullableUserData = {
  [K in keyof UserData]: Nullable<UserData[K]>;
};
/** all the user data can be optionally visible except id */
export type VisibleUserData = Partial<Omit<NullableUserData, 'id'>>;
/** everything except generated data is edittable for now */
export type EditableUserData = RegisterFormInputs;
