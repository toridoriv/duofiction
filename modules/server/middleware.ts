import { express, WalkOptions } from "@modules/server/deps.ts";
import {
  getFilePaths,
  isErrorMiddlewareHandler,
  isMiddlewareHandler,
  toNamespacePath,
} from "@modules/server/utils.ts";

const MIDDLEWARE_WALK_OPTIONS: WalkOptions = {
  includeDirs: false,
  exts: [".ts"],
  match: [/\_middlewares/],
};

/**
 * Defines a middleware handler by assigning it a priority property.
 * This allows middleware to be sorted by priority order.
 */
export function defineMiddleware<O extends Route.HandlersOptions>(
  handler: Route.HappyHandler<O>,
  priority: number,
) {
  Object.defineProperty(handler, "priority", {
    value: priority,
    enumerable: true,
  });

  return handler as Middlewares.Middleware<O>;
}

/**
 * Defines an error middleware handler by assigning it a priority property.
 * This allows error middleware to be sorted by priority order.
 */
export function defineErrorMiddleware<O extends Route.HandlersOptions>(
  handler: Route.ErrorHandler<O>,
  priority: number,
) {
  Object.defineProperty(handler, "priority", {
    value: priority,
    enumerable: true,
  });

  return handler as Middlewares.ErrorMiddleware<O>;
}

/**
 * @internal
 */
export function getMiddlewaresPaths(dir: string) {
  return getFilePaths(dir, MIDDLEWARE_WALK_OPTIONS).map(toNamespacePath);
}

/**
 * @internal
 */
export function registerMiddlewares(
  app: express.Application,
  mapping: Middlewares.Mapping,
  areErrorMiddlewares = false,
) {
  for (const path in mapping) {
    const handlers = mapping[path]
      .filter(
        areErrorMiddlewares ? isErrorMiddlewareHandler : isMiddlewareHandler,
      )
      .sort(sortByPriority);

    if (handlers.length > 0) {
      app.use(path, ...handlers);
    }
  }
}

function sortByPriority(
  handler1: Middlewares.Middleware | Middlewares.ErrorMiddleware,
  handler2: Middlewares.Middleware | Middlewares.ErrorMiddleware,
) {
  return handler1.priority - handler2.priority;
}

declare global {
  namespace Middlewares {
    type AnyMiddleware = Middleware | ErrorMiddleware;

    type Mapping = Record<string, AnyMiddleware[]>;

    type Options = {
      priority: number;
    };

    type ErrorMiddleware<
      O extends Route.HandlersOptions = Route.HandlersOptions,
    > = Route.ErrorHandler<O> & {
      priority: number;
      path: string;
    };

    type Middleware<O extends Route.HandlersOptions = Route.HandlersOptions> =
      & Route.HappyHandler<O>
      & {
        priority: number;
        path: string;
      };
  }
}
