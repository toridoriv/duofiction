import { type express, SafeAny, Status, z } from "@deps";
import {
  HTTP_METHOD,
  OPERATION_BY_METHOD,
  STATUS_TEXT,
} from "./endpoint.const.ts";
import {
  anySchema,
  type InferPayload,
  type InferSettings,
  type PayloadSchema,
  rawPayloadSchema,
  sharedSettingsSchema,
} from "./endpoint.utils.ts";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const settingsSchema = sharedSettingsSchema.extend({
  method: z.nativeEnum(HTTP_METHOD),
  resource: z.string(),
  data: anySchema,
});

class ValidationError extends Error {
  constructor(
    readonly detail: string,
    readonly code: string,
    readonly source?: Record<string, string>,
  ) {
    super();
  }
}

export class ApiResponse<T> {
  readonly timestamp = new Date();

  public status!: Status;
  public status_text!: typeof STATUS_TEXT[keyof typeof STATUS_TEXT];
  public errors: Error[] | null = null;
  public data: T | null = null;

  public constructor(readonly operation: string = "unknown") {}

  public setStatus(status: Status) {
    this.status = status;
    this.status_text = STATUS_TEXT[this.status];

    return this;
  }

  public setData(data: T) {
    this.data = data;

    return this;
  }

  public setErrors(...errors: Error[]) {
    this.errors = errors.map((e) => {
      Object.defineProperty(e, "message", {
        enumerable: true,
      });

      return e;
    });

    return this;
  }
}

// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export class EndpointApi<
  In extends EndpointApiSettings,
  Settings extends InferApiEndpointSettings<In> = InferApiEndpointSettings<In>,
> {
  public static init<In extends EndpointApiSettings>(settings: In) {
    return new EndpointApi(settings);
  }

  readonly method!: Settings["method"];
  readonly resource!: Settings["resource"];
  readonly path!: Settings["path"];
  readonly data!: Settings["data"];

  readonly payload: PayloadSchema<In["payload"]>;
  readonly operation: string;

  readonly $handlers: ApiEndpointHandler<In["payload"], this>[] = [];

  get handlers(): ApiEndpointHandler<In["payload"], EndpointApi<Settings>>[] {
    return this.$handlers.map((fn) => fn.bind(this)) as ApiEndpointHandler<
      In["payload"],
      EndpointApi<Settings>
    >[];
  }

  protected constructor({ payload, ...input }: In) {
    Object.assign(this, settingsSchema.parse(input));

    this.operation = `${OPERATION_BY_METHOD[this.method]}.${this.resource}`;
    this.payload = rawPayloadSchema.extend(payload || {}) as PayloadSchema<
      In["payload"]
    >;
  }

  protected getResponse(status: Status) {
    return new ApiResponse<z.output<In["data"]>>(this.operation).setStatus(
      status,
    );
  }

  protected validateRequest: ApiEndpointHandler<In["payload"], this> =
    function (req, res, next) {
      const validation = this.payload.safeParse(req);

      if (!validation.success) {
        const response = this.getResponse(Status.BadRequest).setErrors(
          ...validation.error.issues.map(zodIssueToValidationError),
        );

        return res.status(response.status).json(response);
      }

      Object.assign(req, validation.data);

      return next();
    };

  protected wrapHandler(handler: ApiEndpointHandler<In["payload"], this>) {
    const handlerName = handler.name.substring(0, 1).toUpperCase() +
      handler.name.substring(1);
    const name = `wrapped${handlerName}`;
    type Params = Parameters<typeof handler>;

    const { [name]: wrappedHandler } = {
      [name]: async function (req: Params[0], res: Params[1], next: Params[2]) {
        try {
          const r = await handler.call(this, req, res, next);

          return r;
        } catch (error) {
          const response = this.getResponse(
            Status.InternalServerError,
          ).setErrors(error);

          return res.status(response.status).json(response);
        }
      },
    };

    return wrappedHandler;
  }

  public registerHandler(handler: (typeof this)["$handlers"][number]) {
    this.$handlers.push(this.wrapHandler(handler));

    return this;
  }
}

/**
 * @public
 */
export type ExpressApiRequest<
  T,
  P extends InferPayload<T> = InferPayload<T>,
> = express.Request<P["params"], SafeAny, P["body"], P["query"]>;

/**
 * @public
 */
export type ExpressApiResponse<T> = express.Response<ApiResponse<T>>;

/**
 * @public
 */
export type EndpointApiSettings = z.input<typeof settingsSchema>;

/**
 * @public
 */
export type ApiEndpointHandler<T, U> = (
  this: U,
  req: ExpressApiRequest<T>,
  res: express.Response,
  next: express.NextFunction,
) => unknown | Promise<unknown>;

/**
 * @public
 */
export type AnyApiEndpoint = EndpointApi<SafeAny, SafeAny>;

// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function zodIssueToValidationError(value: z.ZodIssue) {
  const [field, ...rest] = value.path;

  return new ValidationError(value.message, value.code, {
    [field]: rest.join("."),
  });
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
type InferApiEndpointSettings<S extends EndpointApiSettings> = InferSettings<
  typeof settingsSchema,
  S
>;

// #endregion
