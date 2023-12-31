/**
 * Instead of adding a `disable` directive, use this value
 * to indicate that an any type is expected that way purposely.
 */
// deno-lint-ignore no-explicit-any
export type SafeAny = any;

/**
 * Represents any possible array.
 */
export type AnyArray = Array<SafeAny>;

/**
 * Represents a function that can accept any number of arguments
 * of any type and returns a value of any type.
 *
 * This is useful for representing loosely typed callback functions
 * where the arguments and return value are not known or relevant.
 */
export type AnyFunction = (...args: AnyArray) => SafeAny;

/**
 * Represents an object type where the keys can be
 * either strings or numbers, and the values are any type.
 *
 * This is useful for representing loose object types where
 * the keys and values are not known ahead of time.
 */
export type AnyRecord = Record<string | number, SafeAny>;

/**
 * Takes a type T and expands it to an object type with all properties set to their original types.
 *
 * @example
 * ```ts
 *  // On hover: interface Person
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * // On hover: type ExpandedPerson = { name: string; age: number }
 * type ExpandedPerson = Expand<Person>;
 * ```
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Recursively expands a type T to an object type with all nested properties mapped to their original types.
 * This is like {@link Expand} but works recursively to expand nested object properties.
 *
 * @example
 * ```ts
 * // On hover: interface Person
 * interface Person {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   }
 * }
 *
 * // On hover: type RecursivePerson = {
 * //   name: string;
 * //   address: {
 * //     street: string;
 * //     city: string;
 * //   }
 * // }
 * type RecursivePerson = ExpandRecursively<Person>;
 * ```
 */
export type ExpandRecursively<T, Unless = null> = T extends object
  ? T extends infer O ? O extends Unless ? O
    : {
      [K in keyof O]: O[K] extends AnyFunction ? O[K]
        : ExpandRecursively<O[K], Unless>;
    }
  : never
  : T;

/**
 * Checks if a type T is an actual object. It excludes
 * `Date` and `Array` types.
 */
export type IsNativeObject<T> = T extends Date ? false
  : T extends Array<SafeAny> ? false
  : T extends Record<string, SafeAny> ? true
  : false;

/**
 * Gets the names of properties on type T that are native object types.
 */
export type ObjectPropertyNames<T> = {
  [K in keyof T]: IsNativeObject<T[K]> extends true ? K : never;
}[keyof T];

/**
 * Gets the names of properties on type T that are **NOT** native object types.
 */
export type NonObjectPropertyNames<T> = {
  [K in keyof T]: IsNativeObject<T[K]> extends true ? never : K;
}[keyof T];

/**
 * Constructs a new type by picking only the properties from `T`
 * that are native object types.
 */
export type ObjectProperties<T> = Pick<T, ObjectPropertyNames<T>>;

/**
 * Joins two types into a dot-delimited string literal type.
 *
 * @example
 * ```ts
 * type A = "foo";
 * type B = "bar";
 *
 * type AB = JoinWithDot<A, B>;
 * // "foo.bar"
 * ```
 */
export type JoinWithDot<
  K extends string | number,
  P extends string | number,
> = `${K}.${P}`;

/**
 * Splits a dot-delimited string literal type into separate types.
 *
 * @example
 * ```ts
 * type AB = "a.b";
 *
 * type A = SplitDotted<AB>[0]; // "a"
 * type B = SplitDotted<AB>[1]; // "b"
 * ```
 */
export type SplitDotted<T> = T extends string ? SplitText<T, "."> : never;

/**
 * Splits a string into an array by a delimiter.
 *
 * @example
 * ```ts
 * type Parts = SplitText<"a.b.c", "."> // ['a', 'b', 'c']
 * ```
 */
export type SplitText<S extends string, D extends string> = string extends S
  ? string[]
  : S extends "" ? []
  : S extends `${infer T}${D}${infer U}` ? [T, ...SplitText<U, D>]
  : [S];

/**
 * Gets the tail of a tuple type by removing the first element.
 *
 * @example
 * ```ts
 * type Tuple = [1, 2, 3];
 * type Tail = Tail<Tuple>; // [2, 3]
 * ```
 */
export type Tail<T> = T extends [infer _FirstItem, ...infer Rest] ? Rest
  : never;

/**
 * Checks if the given array type T has a length of `0`.
 */
export type HasLengthZero<T> = T extends Array<SafeAny>
  ? T["length"] extends 0 ? true
  : false
  : never;

/**
 * Checks if the given array type T has a length of `1`.
 */
export type HasLengthOne<T> = T extends Array<SafeAny>
  ? T["length"] extends 1 ? true
  : false
  : never;

/**
 * Gets the type of the property K from type T.
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * type Name = GetPropertyType<Person, 'name'>; // string
 * ```
 */
export type GetPropertyType<T, K> = K extends keyof T ? T[K] : never;

/**
 * Gets the type of a nested property path on a type T.
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string;
 *   address: {
 *     street: string;
 *   }
 * }
 *
 * type Street = GetNestedPropertyType<Person, ['address', 'street']>;
 * // string
 * ```
 */
export type GetNestedPropertyType<
  T,
  Path extends AnyArray,
> = HasLengthOne<Path> extends true ? GetPropertyType<T, Path[0]>
  : GetNestedPropertyType<GetPropertyType<T, Path[0]>, Tail<Path>>;

/**
 * Converts a union type into an intersection type.
 *
 * @example
 * ```ts
 * type A = string | number;
 * type B = UnionToIntersection<A>; // string & number
 * ```
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0 ? I
  : never;

/**
 * Gets the last type in a union type U.
 *
 * @example
 * ```ts
 * type A = string | number;
 * type B = LastInUnion<A>; // number
 * ```
 */
export type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0 ? L
  : never;

/**
 * Converts a union type into a tuple of its members.
 *
 * @example
 * ```ts
 * type A = string | number;
 * type B = UnionToTuple<A>; // [string, number]
 * ```
 */
export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never] ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

/**
 * Converts a type T into a tuple of its keys.
 *
 * @example
 * ```ts
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * type Keys = GetKeys<Person>; // ['name', 'age']
 * ```
 */
export type GetKeys<T> = UnionToTuple<keyof T>;

/**
 * Concatenates two tuple types T and U into a new tuple.
 *
 * @example
 * ```ts
 * type A = [1, 2];
 * type B = [3, 4];
 *
 * type C = Concat<A, B>; // [1, 2, 3, 4]
 * ```
 */
export type Concat<T extends AnyArray, U extends AnyArray> = [...T, ...U];

/**
 * Converts a type T into an object type with dot-notation keys.
 *
 * The keys are generated from the nested object structure of T.
 *
 * @example
 *
 * ```ts
 * interface Person {
 *   name: string;
 *   address: {
 *     street: string;
 *   }
 * }
 *
 * type PersonDotNotation = ToDotNotation<Person>;
 *
 * //  type PersonDotNotation = {
 * //     name: string;
 * //     address: {
 * //         street: string;
 * //     };
 * //     "address.street": string;
 * //   }
 * ```
 */
export type ToDotNotation<T> = {
  [K in DotNotationPathOf<T>]: DotNotationDataTypeOf<T, K>;
};

/**
 * Converts an array type T to a dot-notation string type representing
 * the array elements and indices.
 *
 * Array elements are recursively converted to dot-notation as well.
 *
 * @example
 *
 * ```ts
 * type Address = {
 *   street: string;
 *   number: number;
 *   country: string;
 * }
 *
 * type Person = { name: string; address: Address };
 * type ArrayDotNotation = ArrayDotNotation<Array>
 * type PeopleDotNotation = ArrayDotNotation<People>;
 * // `${number}.name` | `${number}.address` | `${number}.address.number` | `${number}.address.street`
 * // `${number}.address.country` | "$[elem].name" | "$[elem].address" | "$[elem].address.number"
 * // "$[elem].address.street" | "$[elem].address.country"
 * ```
 */
export type ArrayDotNotation<T> = T extends Array<infer U>
  ? `${number | "$[elem]"}.${ArrayDotNotation<U>}`
  : T extends Record<string, unknown> ? `${DotNotationPathOf<T>}`
  : never;

/**
 * Joins the elements of an array T into a string, delimited by U.
 *
 * @example
 *
 * ```ts
 * type Letters = ['a', 'b', 'c']
 * type Joined = Join<Letters, '.'> // 'a.b.c'
 * ```
 */
export type Join<T extends SafeAny[], U extends string | number> = T extends [
  infer F,
  ...infer R,
] ? R["length"] extends 0 ? `${F & string}`
  : `${F & string}${U}${Join<R, U>}`
  : never;

/**
 * Converts a type with dot-notation keys back to a nested object type.
 *
 * This reverses the transformation done by {@link ToDotNotation}.
 *
 * @example
 *
 * ```ts
 * type PersonDotNotation = {
 *   name: string;
 *   "address.street": string;
 * }
 *
 * type Person = FromDotNotation<PersonDotNotation>
 *
 * // Person = {
 * //   name: string;
 * //   address: {
 * //     street: string;
 * //   }
 * // }
 * ```
 */
export type FromDotNotation<T> = ExpandRecursively<
  {
    [K in keyof T as SplitDotted<K>[0]]: HasLengthZero<
      Tail<SplitDotted<K>>
    > extends true ? T[K]
      : Tail<SplitDotted<K>>[0] extends `${number}` ? T[K]
      : FromDotNotation<{ [SubKey in Join<Tail<SplitDotted<K>>, ".">]: T[K] }>;
  }
>;

/**
 * Excludes any properties with `never` type from type T.
 *
 * This is useful for cleaning up types after mapped types that may
 * introduce `never` properties.
 *
 * @example
 *
 * ```ts
 * type Test = {
 *   foo: string;
 *   bar?: never;
 * }
 *
 * type Clean = ExcludeNever<Test>;
 * // { foo: string }
 * ```
 */
export type ExcludeNever<T> = {
  [
    K in keyof T as NonNullable<T[K]> extends never ? never
      : K
  ]: T[K] extends Array<infer L> ? L extends AnyRecord ? ExcludeNever<L>[]
    : T[K]
    : T[K] extends AnyRecord ? ExcludeNever<T[K]>
    : T[K];
};

/**
 * Makes all properties in T optional.
 */
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

/**
 * Returns the known keys of type T, filtering out any not named keys.
 *
 * @example
 * ```ts
 * type Person = {
 *   [k: string]: unknown;
 *   name: string;
 *   age: number;
 * }
 *
 * type KnownKeysOfPerson = KnownKeys<Person>;
 * ```
 */
export type KnownKeys<T> = keyof ExcludeNever<
  {
    // @ts-ignore: ¯\_(ツ)_/¯
    [K in keyof T]: `string` extends `${K}` ? never
      // @ts-ignore: ¯\_(ツ)_/¯
      : `number` extends `${K}` ? never
      : K;
  }
>;

/**
 * Removes any index signature keys from the type T, returning
 * a new type with only the known keys.
 * @example
 * ```ts
 * type RawPerson = {
 *   [k: string]: unknown;
 *   name: string;
 *   age: number;
 * }
 *
 * type Person = RemoveIndex<RawPerson>; // { name: string; age: number; }
 * ```
 */
export type RemoveIndex<T extends Record<SafeAny, SafeAny>> = Pick<
  T,
  KnownKeys<T>
>;

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region

type BaseDotNotationArrayKey<K extends string> =
  | `${K}.${number}`
  | `${K}.$[elem]`;

type DotNotationPathOf<T> = {
  [K in keyof T & string]: T[K] extends Array<infer U> ?
      | K
      | BaseDotNotationArrayKey<K>
      | `${BaseDotNotationArrayKey<K>}.${ArrayDotNotation<U>}`
    : T[K] extends Record<string, unknown>
    // @ts-ignore: ¯\_(ツ)_/¯
      ? `${K}` | `${K}.${DotNotationPathOf<T[K]>}`
    : K;
}[keyof T & string];

type DotNotationDataTypeOf<
  T,
  P extends DotNotationPathOf<T> | string,
> = P extends keyof T ? T[P]
  : P extends `$[elem]` ? T extends Array<infer E> ? E
    : never
  : P extends `${number}` ? T extends Array<infer E> ? E
    : never
  : P extends `${infer First}.${infer Rest}`
    ? First extends keyof T ? DotNotationDataTypeOf<T[First], Rest>
    : First extends `${number}`
      ? T extends Array<infer E> ? DotNotationDataTypeOf<E, Rest>
      : never
    : First extends `$[elem]`
      ? T extends Array<infer E> ? DotNotationDataTypeOf<E, Rest>
      : never
    : never
  : never;
