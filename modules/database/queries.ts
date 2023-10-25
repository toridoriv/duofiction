import type {
  BaseDocument,
  MongoDocument,
} from "@modules/database/document.ts";
import type {
  AnyRecord,
  DeepPartial,
  ExcludeNever,
  ExpandRecursively,
  FromDotNotation,
  GetKeys,
  IsNativeObject,
  KnownKeys,
  RemoveIndex,
  ToDotNotation,
} from "@modules/typings/utilities.ts";
import type { mongodb } from "@modules/database/deps.ts";

type CustomExpand<T> = ExpandRecursively<T, Date | mongodb.UUID>;

export namespace Projection {
  export type Include = 1;
  export type Exclude = 0;

  export const Include: Include = 1;
  export const Exclude: Exclude = 0;

  export type BaseProperties = {
    _id?: Include | Exclude;
    created_at?: Exclude;
    updated_at?: Exclude;
  };

  export type Document<T extends BaseDocument> = {
    [K in keyof ToDotNotation<T>]?: Exclude;
  };

  export type Infer<
    T extends BaseDocument,
    P extends Projection<T>,
  > = CustomExpand<ExcludeNever<InferHelper<T, P>>>;

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
  Projection.BaseProperties & Projection.Document<T>
>;

export namespace Query {
  export type Operators<T> = T extends Array<infer E>
    ? BaseFilterOperators<T> & { $elemMatch: Operators<E> }
    : T extends string | RegExp ? BaseFilterOperators<T | RegExp> & {
        $not: T extends string | RegExp ? string | RegExp : Operators<T>;
      }
    : BaseFilterOperators<T>;

  export interface FindOptions<T> extends BaseFindOptions {
    projection?: Projection<T>;
    sort?: {
      [K in keyof (T & MongoDocument)]?: mongodb.SortDirection;
    };
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

  export type Property<T> = T extends string ? T | RegExp
    : T extends AnyRecord ? DeepPartial<T>
    : T;

  export type Base<T, Dot extends ToDotNotation<T> = ToDotNotation<T>> =
    & {
      [K in keyof Dot]?: Property<Dot[K]> | Operators<Dot[K]>;
    }
    & { $expr?: { $gt?: string[] } };

  type ExcludeFromFindOptions = "projection" | "sort";
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
      K in keyof mongodb.UpdateFilter<
        ToDotNotation<T>
      > as K extends ExcludeFromUpdate ? never : K
    ]: mongodb.UpdateFilter<
      ToDotNotation<T>
    >[K];
  };

  type OmitFromFilter = "$not" | KnownKeys<mongodb.NonObjectIdLikeDocument>;

  type BaseFilterOperators<T> = RemoveIndex<
    {
      [
        K in keyof mongodb.FilterOperators<T> as K extends OmitFromFilter
          ? never
          : K
      ]?: mongodb.FilterOperators<T>[K];
    }
  >;
}

export type Query<T> = DeepPartial<Query.Base<T>>;
