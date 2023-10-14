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
export type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> }
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

export type ArrayDotNotation<T> = T extends Array<infer U>
  ? `${number}${ArrayDotNotation<U>}`
  : T extends Record<string, unknown> ? `${DotNotationPathOf<T>}`
  : never;

export type ExcludeDotNotation<T> = {
  [K in keyof T]: K extends `${string}.${string}` ? never : K;
}[keyof T];

export type FromDotNotation<T> = Pick<T, ExcludeDotNotation<T>>;

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region

type DotNotationPathOf<T> = {
  [K in keyof T & string]: T[K] extends Array<infer U>
    ? K | `${K}.${number}` | `${K}.${number}.${ArrayDotNotation<U>}`
    : T[K] extends Record<string, unknown>
    // @ts-ignore: ¯\_(ツ)_/¯
      ? `${K}` | `${K}.${DotNotationPathOf<T[K]>}`
    : K;
}[keyof T & string];

type DotNotationDataTypeOf<
  T,
  P extends DotNotationPathOf<T> | string,
> = P extends `${infer K}.${infer R}`
  // @ts-ignore: ¯\_(ツ)_/¯
  ? DotNotationDataTypeOf<T[K], R>
  : P extends `${infer K}`
  // @ts-ignore: ¯\_(ツ)_/¯
    ? T[K]
  : never;
// #endregion
