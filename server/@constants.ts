import { Status, z } from "@deps";

const IS_READONLY = Deno.env.get("IS_READONLY") === "false" ? false : true;

const PORT = z.coerce
  .number()
  .int()
  .default(8000)
  .catch(8000)
  .parse(Deno.env.get("PORT"));

const ENVIRONMENT = z
  .preprocess(
    (x) => String(x).toUpperCase(),
    z
      .enum(["DEVELOPMENT", "PRODUCTION"])
      .default("PRODUCTION")
      .catch("PRODUCTION"),
  )
  .parse(Deno.env.get("ENVIRONMENT"));

const LOCATION = z.string().url().parse(Deno.env.get("LOCATION"));

const AVAILABLE_HTTP_METHOD = Object.freeze({
  post: "post",
  get: "get",
  patch: "patch",
  delete: "delete",
});

const AVAILABLE_HTTP_METHODS = Object.values(AVAILABLE_HTTP_METHOD);

const AVAILABLE_HTTP_METHODS_IN_READONLY = [
  AVAILABLE_HTTP_METHOD.get,
] as (keyof typeof AVAILABLE_HTTP_METHOD)[];

const OPERATION_BY_METHOD = Object.freeze({
  [AVAILABLE_HTTP_METHOD.post]: "create",
  [AVAILABLE_HTTP_METHOD.get]: "retrieve",
  [AVAILABLE_HTTP_METHOD.patch]: "update",
  [AVAILABLE_HTTP_METHOD.delete]: "delete",
});

const STATUS_TEXT = Object.freeze({
  [Status.Accepted]: "Accepted",
  [Status.AlreadyReported]: "Already Reported",
  [Status.BadGateway]: "Bad Gateway",
  [Status.BadRequest]: "Bad Request",
  [Status.Conflict]: "Conflict",
  [Status.Continue]: "Continue",
  [Status.Created]: "Created",
  [Status.EarlyHints]: "Early Hints",
  [Status.ExpectationFailed]: "Expectation Failed",
  [Status.FailedDependency]: "Failed Dependency",
  [Status.Forbidden]: "Forbidden",
  [Status.Found]: "Found",
  [Status.GatewayTimeout]: "Gateway Timeout",
  [Status.Gone]: "Gone",
  [Status.HTTPVersionNotSupported]: "HTTP Version Not Supported",
  [Status.IMUsed]: "IM Used",
  [Status.InsufficientStorage]: "Insufficient Storage",
  [Status.InternalServerError]: "Internal Server Error",
  [Status.LengthRequired]: "Length Required",
  [Status.Locked]: "Locked",
  [Status.LoopDetected]: "Loop Detected",
  [Status.MethodNotAllowed]: "Method Not Allowed",
  [Status.MisdirectedRequest]: "Misdirected Request",
  [Status.MovedPermanently]: "Moved Permanently",
  [Status.MultiStatus]: "Multi Status",
  [Status.MultipleChoices]: "Multiple Choices",
  [Status.NetworkAuthenticationRequired]: "Network Authentication Required",
  [Status.NoContent]: "No Content",
  [Status.NonAuthoritativeInfo]: "Non Authoritative Info",
  [Status.NotAcceptable]: "Not Acceptable",
  [Status.NotExtended]: "Not Extended",
  [Status.NotFound]: "Not Found",
  [Status.NotImplemented]: "Not Implemented",
  [Status.NotModified]: "Not Modified",
  [Status.OK]: "OK",
  [Status.PartialContent]: "Partial Content",
  [Status.PaymentRequired]: "Payment Required",
  [Status.PermanentRedirect]: "Permanent Redirect",
  [Status.PreconditionFailed]: "Precondition Failed",
  [Status.PreconditionRequired]: "Precondition Required",
  [Status.Processing]: "Processing",
  [Status.ProxyAuthRequired]: "Proxy Auth Required",
  [Status.RequestEntityTooLarge]: "Request Entity Too Large",
  [Status.RequestHeaderFieldsTooLarge]: "Request Header Fields Too Large",
  [Status.RequestTimeout]: "Request Timeout",
  [Status.RequestURITooLong]: "Request URI Too Long",
  [Status.RequestedRangeNotSatisfiable]: "Requested Range Not Satisfiable",
  [Status.ResetContent]: "Reset Content",
  [Status.SeeOther]: "See Other",
  [Status.ServiceUnavailable]: "Service Unavailable",
  [Status.SwitchingProtocols]: "Switching Protocols",
  [Status.Teapot]: "I'm a teapot",
  [Status.TemporaryRedirect]: "Temporary Redirect",
  [Status.TooEarly]: "Too Early",
  [Status.TooManyRequests]: "Too Many Requests",
  [Status.Unauthorized]: "Unauthorized",
  [Status.UnavailableForLegalReasons]: "Unavailable For Legal Reasons",
  [Status.UnprocessableEntity]: "Unprocessable Entity",
  [Status.UnsupportedMediaType]: "Unsupported Media Type",
  [Status.UpgradeRequired]: "Upgrade Required",
  [Status.UseProxy]: "Use Proxy",
  [Status.VariantAlsoNegotiates]: "Variant Also Negotiates",
});

export {
  AVAILABLE_HTTP_METHOD,
  AVAILABLE_HTTP_METHODS,
  AVAILABLE_HTTP_METHODS_IN_READONLY,
  ENVIRONMENT,
  IS_READONLY,
  LOCATION,
  OPERATION_BY_METHOD,
  PORT,
  STATUS_TEXT,
};
