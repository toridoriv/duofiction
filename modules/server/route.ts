import { express } from "@modules/server/deps.ts";
import { SafeAny } from "@modules/typings/mod.ts";
import { getFilePaths, toNamespacePath } from "@modules/server/utils.ts";

/**
 * @internal
 *
 * Creates an Express router by registering route handlers from the given directory.
 *
 * It registers route handlers by importing each TypeScript file in the directory,
 * checking if it exports a route handlers object, and registering the route handlers
 * on the router instance.
 *
 * @param dir - The directory containing the route handler modules.
 * @param options - Options to pass to the router instance.
 * @returns The configured router instance.
 */
export function createRouter(
  mapping: Route.Mapping,
  options: express.RouterOptions = {},
) {
  const router = express.Router(options);

  for (const path in mapping) {
    const routeHandlers = mapping[path];

    for (const _ in routeHandlers) {
      const method = _ as Route.Method;
      const handlers = (
        Array.isArray(routeHandlers[method])
          ? routeHandlers[method]
          : [routeHandlers[method]]
      ) as Route.Handler[];

      router[method](path, ...handlers);
    }
  }

  return router;
}

/**
 * Defines the route handlers for the router.
 *
 * This returns a function that accepts the route handlers
 * and returns them so they can be exported as the default export.
 *
 * @returns A function that accepts and returns the route handlers.
 */
export function defineRouteHandlers<O extends Route.HandlersOptions>() {
  return function <Handlers extends Route.Handlers<O>>(handlers: Handlers) {
    return handlers;
  };
}

/**
 * @internal
 */
export function getRoutesPaths(dir: string) {
  return getFilePaths(dir, {
    includeDirs: false,
    exts: [".ts"],
    skip: [/\_/],
  }).map(toNamespacePath);
}

declare global {
  /**
   * Namespace for route handler types and interfaces.
   */
  namespace Route {
    /**
     * Type alias for the route handlers mapping.
     * Maps route paths to the handler functions.
     */
    type Mapping = Record<string, Handlers>;

    /**
     * Options for route handlers.
     *
     * Defines the possible request and response types that can be used in route handlers.
     */
    interface HandlersOptions {
      params?: SafeAny;
      reqBody?: SafeAny;
      query?: SafeAny;
      resBody?: SafeAny;
      locals?: SafeAny;
    }

    /**
     * Type for a route handler that does not return an error.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * @returns The result of the route handler logic.
     */
    type HappyHandler<O extends HandlersOptions = HandlersOptions> = (
      req: Request<O>,
      res: Response<O>,
      next: express.NextFunction,
    ) => SafeAny | Promise<SafeAny>;

    /**
     * Type for a route error handler function.
     *
     * @param error - The error object.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * @returns The result of the error handler logic.
     */
    type ErrorHandler<O extends HandlersOptions = HandlersOptions> = (
      error: Error,
      req: Request<O>,
      res: Response<O>,
      next: express.NextFunction,
    ) => SafeAny | Promise<SafeAny>;

    /**
     * Type alias for a route handler function.
     * A route handler can be a normal handler or an error handler.
     */
    type Handler<O extends HandlersOptions = HandlersOptions> =
      | HappyHandler<O>
      | ErrorHandler<O>;

    /**
     * Route handlers object.
     *
     * Maps {@link express.Router} methods to route handler functions.
     */
    type Handlers<O extends HandlersOptions = HandlersOptions> = Partial<
      Record<Method, HappyHandler<O> | HappyHandler<O>[]>
    >;

    type Method = Exclude<keyof express.Router, "param" | "stack" | "route">;

    /**
     * Request type for route handlers.
     *
     * Extends the Express Request type to include the route handler options for type safety.
     *
     * @param O - Route handler options
     */
    type Request<O extends HandlersOptions = HandlersOptions> = express.Request<
      O["params"],
      O["resBody"],
      O["reqBody"],
      O["query"],
      O["locals"]
    >;

    /**
     * Response type for route handlers.
     *
     * Extends the Express Response type to include the route handler options for type safety.
     *
     * @param O - Route handler options
     */
    type Response<O extends HandlersOptions = HandlersOptions> =
      express.Response<
        O["resBody"],
        O["locals"]
      >;
  }
}
