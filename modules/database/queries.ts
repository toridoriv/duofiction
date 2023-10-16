import { BaseDocument, DocumentSchema } from "@modules/database/document.ts";
import {
  AnyArray,
  ExcludeNever,
  ExpandRecursively,
  FromDotNotation,
  GetKeys,
  IsNativeObject,
  SafeAny,
  ToDotNotation,
} from "@modules/typings/utilities.ts";
import { mongodb } from "@modules/database/deps.ts";

type CustomExpand<T> = ExpandRecursively<T, Date | mongodb.UUID>;

export namespace Projection {
  export type Include = 1;
  export type Exclude = 0;

  export type Id = { _id?: Include | Exclude };

  export type Document<T extends BaseDocument> = {
    [K in keyof ToDotNotation<T>]?: Exclude;
  };

  export type Infer<
    T extends BaseDocument,
    P extends Projection<T>,
  > = ExcludeNever<InferHelper<T, P>>;

  type InferHelper<
    T,
    U extends Projection<T>,
    SolvedP extends FromDotNotation<U> = FromDotNotation<U>,
  > = CustomExpand<
    {
      [K in keyof T]: K extends keyof SolvedP
        ? IsNativeObject<SolvedP[K]> extends true
          // @ts-ignore: ¯\_(ツ)_/¯
          ? InferHelper<T[K], SolvedP[K], SolvedP[K]>
        : never
        : T[K];
    }
  >;

  export type GetExcludedKeys<T> = GetKeys<
    {
      [K in keyof T]: T[K] extends Exclude ? K : never;
    }
  >;
}

export type Projection<T> = CustomExpand<
  // @ts-ignore: ¯\_(ツ)_/¯
  Projection.Id & Projection.Document<T>
>;

export namespace Query {
  export interface Operators<T> extends mongodb.FilterOperators<T> {
    $elemMatch?: T extends AnyArray ? Operators<T[number]> : never;
    $not?: T extends string ? String<T> : Operators<T>;
  }

  export interface FindOptions<T extends BaseDocument> extends BaseFindOptions {
    projection?: Projection<T>;
  }

  export type Update<T extends BaseDocument> = BaseUpdate<T> & {
    $set?: {
      [K in keyof T]?: T[K];
    };
  };

  export interface UpdateOptions<T extends BaseDocument>
    extends BaseUpdateOptions {
    projection?: Projection<T>;
  }

  export type InferFindReturn<
    T extends BaseDocument,
    O extends FindOptions<T> | UpdateOptions<T> | undefined,
  > = O extends undefined ? T
    : O extends { projection: infer P }
      ? P extends Projection<T> ? Projection.Infer<T, P>
      : T
    : T;

  export type Property<T> = T extends string ? String<T> : T;

  export type Base<T extends DocumentSchema<SafeAny>> = {
    [K in keyof T]: Property<T[K]> | Operators<T[K]>;
  };

  type String<T extends string> = T | RegExp;
  type ExcludeFromFindOptions = "projection";
  type ExcludeFromUpdateOptions = "projection";
  type ExcludeFromUpdate = never;

  type BaseFindOptions = {
    [
      K in keyof mongodb.FindOptions as K extends ExcludeFromFindOptions ? never
        : K
    ]: mongodb.FindOptions[K];
  };

  type BaseUpdateOptions = {
    [
      K in keyof mongodb.FindOneAndUpdateOptions as K extends
        ExcludeFromUpdateOptions ? never
        : K
    ]: mongodb.FindOneAndUpdateOptions[K];
  };

  type BaseUpdate<T extends BaseDocument> = {
    [
      K in keyof mongodb.UpdateFilter<ToDotNotation<T>> as K extends
        ExcludeFromUpdate ? never
        : K
    ]: mongodb.UpdateFilter<ToDotNotation<T>>[K];
  };
}

export type Query<T extends DocumentSchema<SafeAny>> = Partial<
  ToDotNotation<
    Query.Base<T>
  >
>;
