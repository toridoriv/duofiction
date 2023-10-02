import { type express, Status, type ValueOf, z } from "@deps";
import {
  API_KEY,
  AVAILABLE_HTTP_METHOD,
  AVAILABLE_HTTP_METHODS_IN_READONLY,
  OPERATION_BY_METHOD,
  STATUS_TEXT,
} from "@constants";
import { anySchema } from "@schemas";
import { Unauthorized, ValidationError } from "@errors";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const rawPayload = z.object({
  body: z.null().default(null).catch(null),
  query: z.null().default(null).catch(null),
  params: z.null().default(null).catch(null),
});

const settings = z.object({
  method: z.nativeEnum(AVAILABLE_HTTP_METHOD),
  payload: z.object({
    body: anySchema.optional(),
    query: anySchema.optional(),
    params: anySchema.optional(),
  }).default({}),
  path: z.string().default("/"),
  resource: z.string(),
  data: anySchema,
});

class ApiResponse<T> {
  readonly timestamp = new Date();

  public status!: Status;
  public status_text!: ValueOf<typeof STATUS_TEXT>;
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

class ApiEndpoint<
  I extends SettingsIn,
  O extends InferSettings<I> = InferSettings<I>,
> {
  readonly method!: O["method"];
  readonly path!: O["path"];
  readonly resource!: O["resource"];
  readonly operation: string;
  readonly payload: PayloadSchema<I["payload"]>;
  readonly data!: I["data"];

  readonly $handlers: ApiEndpointHandler<I["payload"]>[] = [];

  public constructor({ payload, ...input }: I) {
    Object.assign(this, settings.parse(input));

    this.operation = `${OPERATION_BY_METHOD[this.method]}.${this.resource}`;
    this.payload = rawPayload.extend(payload || {}) as PayloadSchema<
      I["payload"]
    >;

    this.$handlers.push(this.validateRequest);

    if (!AVAILABLE_HTTP_METHODS_IN_READONLY.includes(this.method)) {
      this.$handlers.push(this.isAuthorized);
    }
  }

  private isAuthorized: ApiEndpointHandler<I["payload"]> = function (
    this: ApiEndpoint<O>,
    _req,
    res,
    next,
  ) {
    if (AVAILABLE_HTTP_METHODS_IN_READONLY.includes(this.method)) {
      return next();
    }

    const apiKey = res.getHeader("x-api-key");

    if (apiKey === API_KEY) {
      return next();
    }

    const response = this.getResponse(Status.Unauthorized).setErrors(
      new Unauthorized(`Not authorized`),
    );

    return res.status(response.status).json(response);
  };

  private validateRequest: ApiEndpointHandler<I["payload"]> = function (
    this: ApiEndpoint<O>,
    req,
    res,
    next,
  ) {
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

  private wrapHandler(handler: ApiEndpointHandler<I["payload"]>) {
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
          const response = this.getResponse(Status.InternalServerError)
            .setErrors(error);

          return res.status(response.status).json(response);
        }
      },
    };

    return wrappedHandler;
  }

  public get handlers() {
    return this.$handlers.map((x) => x.bind(this));
  }

  public getResponse(status: Status) {
    return new ApiResponse<z.output<I["data"]>>(this.operation).setStatus(
      status,
    );
  }

  public registerHandler(handler: (typeof this)["$handlers"][number]) {
    this.$handlers.push(this.wrapHandler(handler));

    return this;
  }
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
/**
 * @public
 * @param options
 * @returns
 */
export function init<S extends SettingsIn>(options: S) {
  return new ApiEndpoint(options);
}

/**
 * @public
 */
export type ExpressApiRequest<T, P extends InferPayload<T> = InferPayload<T>> =
  express.Request<P["params"], SafeAny, undefined, P["query"]>;

/**
 * @public
 */
export type ExpressApiResponse<T> = express.Response<ApiResponse<T>>;

/**
 * @public
 */
export type ApiEndpointHandler<T> = (
  req: ExpressApiRequest<T>,
  res: express.Response,
  next: express.NextFunction,
) => unknown | Promise<unknown>;

/**
 * @public
 */
export type AnyPayload = z.ZodObject<
  Record<keyof PayloadDefaults, z.ZodTypeAny>
>;

/**
 * @public
 */
export type AnyEndpoint = ApiEndpoint<SafeAny, SafeAny>;

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
type SettingsIn = z.input<typeof settings>;

type SettingsOut = z.output<typeof settings>;

type PayloadIn = z.input<typeof rawPayload>;

type PayloadOut = z.output<typeof rawPayload>;

type PayloadDefaults = {
  [K in keyof (typeof rawPayload)["shape"]]: z.ZodNull;
};

type Nullable = never | undefined | unknown;

type InferSettings<S extends SettingsIn> = {
  [K in keyof SettingsOut]: S[K] extends Nullable ? SettingsOut[K] : S[K];
};

type DefaultPayload = typeof rawPayload["shape"];

type PayloadSchemaShape = {
  body: z.ZodTypeAny;
  params: z.ZodTypeAny;
  query: z.ZodTypeAny;
};

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

declare global {
  type GenericApiResponse<T> = ApiResponse<T>;
}
