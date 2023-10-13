/**
 * Instead of adding a `disable` directive, use this value
 * to indicate that an any type is expected that way purposely.
 */
// deno-lint-ignore no-explicit-any
export type SafeAny = any;

export type AnyArray = Array<SafeAny>;

/**
 * Takes a type T and expands it to an object type with all properties set to their original types.
 *
 * @example
 * ```typescript
 *
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
 * ```typescript
 *
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

/** */
export type ObjectProperties<T> = Pick<T, ObjectPropertyNames<T>>;

export type JoinWithDot<
  K extends string | number,
  P extends string | number,
> = `${K}.${P}`;

export type SplitDotted<T> = T extends string ? SplitText<T, "."> : never;

export type SplitText<S extends string, D extends string> = string extends S
  ? string[]
  : S extends "" ? []
  : S extends `${infer T}${D}${infer U}` ? [T, ...SplitText<U, D>]
  : [S];

export type Tail<T> = T extends [infer _FirstItem, ...infer Rest] ? Rest
  : never;

export type HasLengthZero<T> = T extends Array<SafeAny>
  ? T["length"] extends 0 ? true
  : false
  : never;

export type HasLengthOne<T> = T extends Array<SafeAny>
  ? T["length"] extends 1 ? true
  : false
  : never;

export type GetPropertyType<T, K> = K extends keyof T ? T[K] : never;

export type GetNestedPropertyType<
  T,
  Path extends AnyArray,
> = HasLengthOne<Path> extends true ? GetPropertyType<T, Path[0]>
  : GetNestedPropertyType<GetPropertyType<T, Path[0]>, Tail<Path>>;

export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0 ? I
  : never;

export type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0 ? L
  : never;

export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never] ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

export type GetKeys<T> = UnionToTuple<keyof T>;

export type GetPropertiesPathSimple<O> = Join<GetKeys<O>, ".">;

export type Concat<T extends AnyArray, U extends AnyArray> = [...T, ...U];

export type GetNestedKeys<T, Acc extends AnyArray = []> = {
  [K in keyof T]: IsNativeObject<T[K]> extends true ? [...GetNestedKeys<T[K]>]
    : [K];
}[keyof T];

export type ToDotNotation<T> = {
  [K in DotNotationPathOf<T>]: DotNotationDataTypeOf<T, K>;
};

export type Join<T extends unknown[], U extends string | number> = T extends [
  infer F extends string,
  ...infer R,
] ? R["length"] extends 0 ? `${F}`
  : `${F}${U}${Join<R, U>}`
  : never;

type ArrayDotNotation<T> = T extends Array<infer U>
  ? `${number}.${ArrayDotNotation<U>}`
  : T extends Record<string, unknown> ? `.${DotNotationPathOf<T>}`
  : never;

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
