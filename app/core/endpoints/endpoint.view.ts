import { type express, SafeAny, Status, z } from "@deps";
import {
  anySchema,
  type InferPayload,
  type PayloadSchema,
  rawPayloadSchema,
  sharedSettingsSchema,
} from "./endpoint.utils.ts";
import { HTTP_METHOD } from "./endpoint.const.ts";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const settingsSchema = sharedSettingsSchema.extend({
  view: z.string(),
  context: anySchema,
});

// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export class EndpointView<Settings extends SettingsIn> {
  public static init<Settings extends SettingsIn>(settings: Settings) {
    return new EndpointView(settings);
  }

  readonly method = HTTP_METHOD.get;
  readonly view!: Settings["view"];
  readonly context!: Settings["context"];
  readonly path!: Settings["path"];

  readonly payload: PayloadSchema<Settings["payload"]>;

  private $handlers: ViewEndpointHandler<
    Settings["payload"],
    EndpointView<Settings>
  >[] = [];

  get handlers() {
    return this.$handlers.map((fn) => fn.bind(this));
  }

  protected constructor({ payload, ...input }: Settings) {
    Object.assign(this, settingsSchema.parse(input));

    this.payload = rawPayloadSchema.extend(payload || {}) as PayloadSchema<
      Settings["payload"]
    >;
  }

  protected validateRequest: ViewEndpointHandler<
    Settings,
    EndpointView<Settings>
  > = function (
    this: EndpointView<Settings>,
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

  private wrapHandler(
    handler: ViewEndpointHandler<Settings["payload"], EndpointView<Settings>>,
  ) {
    const handlerName = handler.name.substring(0, 1).toUpperCase() +
      handler.name.substring(1);
    const name = `wrapped${handlerName}`;
    type Params = Parameters<typeof handler>;

    const { [name]: wrappedHandler } = {
      [name]: async function (
        this: EndpointView<Settings>,
        req: Params[0],
        res: Params[1],
        next: Params[2],
      ) {
        try {
          const r = await handler.call(this, req, res, next);

          return r;
        } catch (error) {
          console.log(error);
          res.app.logger.error("There was an error 😭", error);

          return next(error);
        }
      },
    };

    return wrappedHandler;
  }

  public registerHandler(
    handler: ViewEndpointHandler<Settings["payload"], EndpointView<Settings>>,
  ) {
    this.$handlers.push(this.wrapHandler(handler));

    return this;
  }

  public renderOk(
    res: express.Response,
    context: z.input<Settings["context"]>,
  ) {
    return res.status(Status.OK).render(
      this.view,
      this.context.parse(context),
    );
  }

  public renderNotOk(
    status: Status,
    res: express.Response,
    context: z.input<Settings["context"]>,
  ) {
    return res.status(status).render(this.view, this.context.parse(context));
  }
}

export type ExpressWebRequest<T, P extends InferPayload<T> = InferPayload<T>> =
  express.Request<P["params"], SafeAny, undefined, P["query"]>;

export type ViewEndpointHandler<T, U> = (
  this: U,
  req: ExpressWebRequest<T>,
  res: express.Response,
  next: express.NextFunction,
) => unknown | Promise<unknown>;
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
type SettingsIn = z.input<typeof settingsSchema>;
// #endregion
