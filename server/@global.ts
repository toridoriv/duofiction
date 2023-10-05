import type { express, Logger } from "@deps";
import { databaseClient, FanfictionRepository } from "./database.ts";
import { AnyApiResponse } from "./api/@endpoint.ts";

declare global {
  /**
   * Instead of adding a `disable` directive, use this value
   * to indicate that an any type is expected that way purposely.
   */
  // deno-lint-ignore no-explicit-any
  type SafeAny = any;

  export type ApiResponseType<T = unknown> = AnyApiResponse<T>;

  namespace Express {
    interface Application {
      db: typeof databaseClient;
      fanficRepository: FanfictionRepository;
      logger: Logger;
      get(name: "environment"): "DEVELOPMENT" | "PRODUCTION";
      get(name: "is-production"): boolean;
      get(name: "is-readonly"): boolean;
      get(name: "port"): number;
      set(name: "is-production", value: boolean): this;
      set(name: "is-readonly", value: boolean): this;
      set(name: "port", value: number): this;
    }

    interface Request {}

    interface Response {}

    interface Router extends express.Router {}

    interface Locals {
      // isReadonly
    }
  }

  type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

  type ExpandRecursively<T> = T extends object
    ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
    : T;
}
