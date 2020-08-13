type Nullable<T> = T | undefined | null;

/** user data but each of its property is nullable & can be undefined */
// (ie union null, undefined to each properties)
type NullableData<T> = {
  [K in keyof T]: Nullable<T[K]>;
};
