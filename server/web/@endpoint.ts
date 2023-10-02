import { express, Status, z } from "@deps";
import { AVAILABLE_HTTP_METHOD } from "@constants";
import { anySchema } from "@schemas";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */

// #region
const rawPayload = z.object({
  query: z.null().default(null).catch(null),
  params: z.null().default(null).catch(null),
});

const settings = z.object({
  payload: z.object({
    query: anySchema.optional(),
    params: anySchema.optional(),
  }).default({}),
  view: z.string(),
  path: z.string(),
  context: anySchema,
});

class WebEndpoint<I extends SettingsIn> {
  readonly method = AVAILABLE_HTTP_METHOD.get;
  readonly view!: I["view"];
  readonly context!: I["context"];
  readonly path!: I["path"];
  readonly payload: PayloadSchema<I["payload"]>;

  #handlers: WebEndpointHandler<I["payload"]>[] = [];

  public constructor(input: I) {
    Object.assign(this, settings.parse(input));

    this.payload =
      (input.payload
        ? rawPayload.extend(input.payload)
        : rawPayload) as PayloadSchema<I["payload"]>;

    this.#handlers.push(this.validateRequest);
  }

  public get handlers() {
    return this.#handlers.map((x) => x.bind(this));
  }

  private validateRequest: WebEndpointHandler<I> = function (
    this: WebEndpoint<I>,
    req,
    _res,
    next,
  ) {
    const validation = this.payload.safeParse(req);

    if (!validation.success) {
      throw validation.error;
    }

    Object.assign(req, validation.data);

    return next();
  };

  public registerHandler(handler: WebEndpointHandler<I["payload"]>) {
    this.#handlers.push(handler);

    return this;
  }

  public renderOk(res: express.Response, context: z.input<I["context"]>) {
    return res.status(Status.OK).render(
      this.view,
      this.context.parse(context),
    );
  }

  public renderNotOk(
    status: Status,
    res: express.Response,
    context: z.input<I["context"]>,
  ) {
    return res.status(status).render(this.view, this.context.parse(context));
  }
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
/**
 * @public
 * @param settings
 * @returns
 */
export function init<S extends SettingsIn>(settings: S) {
  return new WebEndpoint(settings);
}

export type ExpressWebRequest<T, P extends InferPayload<T> = InferPayload<T>> =
  express.Request<P["params"], SafeAny, undefined, P["query"]>;

export type WebEndpointHandler<T> = (
  req: ExpressWebRequest<T>,
  res: express.Response,
  next: express.NextFunction,
) => void | Promise<void>;

// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
type SettingsIn = z.input<typeof settings>;

type SettingsOut = z.output<typeof settings>;

type DefaultPayload = typeof rawPayload["shape"];

type PayloadSchemaShape = { params: z.ZodTypeAny; query: z.ZodTypeAny };

type InferPayloadShape<T> = {
  [K in keyof PayloadSchemaShape]: K extends keyof T
    ? T[K] extends z.ZodTypeAny ? T[K] : DefaultPayload[K]
    : DefaultPayload[K];
};

type PayloadSchema<T> = z.ZodObject<InferPayloadShape<T>>;
type InferPayload<T, S extends PayloadSchema<T> = PayloadSchema<T>> = z.output<
  S
>;
// #endregion
