// deno-lint-ignore-file no-explicit-any
import { express } from "@deps";

export type Handler = (
  req: express.Request<any, any, any, any, any>,
  res: express.Response,
  next: express.NextFunction,
) => unknown | Promise<unknown>;

type RequestMethod = "get" | "post" | "patch" | "delete";

export class Controller<H extends Handler> {
  #handlers: Handler[] = [];

  constructor(
    readonly method: RequestMethod,
    readonly mainHandler: H,
    readonly path = "",
  ) {}

  public addHandlers(...handlers: (H | Handler)[]) {
    this.#handlers.push(...handlers);

    return this;
  }

  get handlers() {
    return this.#handlers.concat(tryCatchWrapper(this.mainHandler));
  }
}

function tryCatchWrapper(handler: Handler) {
  return function tryCatch(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      return handler(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}
