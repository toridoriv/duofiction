// deno-lint-ignore-file no-explicit-any
import {
  ansicolors,
  formatDate,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isSuccessfulStatus,
  z,
} from "@deps";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const SeverityName = {
  Silent: "Silent",
  Debug: "Debug",
  Informational: "Informational",
  Warning: "Warning",
  Error: "Error",
} as const;

enum LoggerSeverity {
  Silent = 0,
  Debug = 1,
  Informational = 2,
  Warning = 3,
  Error = 4,
}

const Level = {
  Error: "ERROR",
  Warn: "WARN",
  Info: "INFO",
  Http: "HTTP",
  Debug: "DEBUG",
} as const;

const Theme = {
  [Level.Error]: ansicolors.bold.red,
  [Level.Warn]: ansicolors.bold.yellow,
  [Level.Info]: ansicolors.bold.green,
  [Level.Http]: ansicolors.bold.cyan,
  [Level.Debug]: ansicolors.bold.blue,
};

const HttpStatusTheme = {
  Informational: ansicolors.bold.cyan,
  Successful: ansicolors.bold.cyan,
  Redirection: ansicolors.bold.yellow,
  Error: ansicolors.bold.red,
  Default: ansicolors.bold,
};

const sharedTemplate = `${
  ansicolors.bold.dim(
    "{@timestamp}",
  )
} {log.level} [${ansicolors.bold.white("{log.logger}")}]`;

const prettyTemplate = `${sharedTemplate} ${
  ansicolors.dim(
    "{log.origin.file.path}:{log.origin.file.line}:{log.origin.file.column}",
  )
} ${ansicolors.yellow("{message}")} {data}`;

const prettyHttpTemplate = `${sharedTemplate} "${
  ansicolors.bold.greenBright(
    "{http.request.method} {http.request.url.original}",
  )
} ${
  ansicolors.bold.green.dim(
    "HTTP/{http.version}",
  )
}" {http.response.status_code} ${ansicolors.bold.dim("{event.duration}ms")}`;

const prettyErrorTemplate = `${sharedTemplate} ${
  ansicolors.dim(
    "{log.origin.file.path}:{log.origin.file.line}:{log.origin.file.column}",
  )
} ${ansicolors.yellow("{message}")}\n${ansicolors.bold.bgRed("{error.id}")}: ${
  ansicolors.bold("{error.message}")
} {error.stack_trace}`;

const DefaultTransports = {
  [SeverityName.Silent]: doNothing,
  [SeverityName.Debug]: console.debug,
  [SeverityName.Informational]: console.info,
  [SeverityName.Warning]: console.warn,
  [SeverityName.Error]: console.error,
};

const LoggerSettingsSchema = z.object({
  severity: z.nativeEnum(LoggerSeverity),
  application: z.string(),
  environment: z.string(),
  module: z.string().optional(),
  id: z.string().optional(),
  version: z.string(),
  padding: z.number().int().default(Level.Debug.length + 1),
  mode: z.enum(["pretty", "json"]),
  transports: z.custom<typeof DefaultTransports>().default(DefaultTransports),
  prettyTemplate: z.string().default(prettyTemplate),
  prettyErrorTemplate: z.string().default(prettyErrorTemplate),
  prettyHttpTemplate: z.string().default(prettyHttpTemplate),
  inspectOptions: z.custom<Deno.InspectOptions>().default({
    colors: true,
  }),
});

class LogObject {
  #error?: LogObject.Error;
  #request?: LogObject.Request;
  #response?: LogObject.Response;

  readonly "@timestamp" = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
  public "log.level": Logger.LevelName = "" as Logger.LevelName;
  public message = "";
  public data: LogObject.OptionalField<Array<unknown>> = undefined;
  public labels: LogObject.OptionalField<Record<string, string>> = undefined;
  public tags: LogObject.OptionalField<string[]> = undefined;
  public "log.logger" = "unknown";
  public "log.origin.file.column" = 0;
  public "log.origin.file.line" = 0;
  public "log.origin.file.name" = "";
  public "log.origin.file.path" = "";
  public "error.code": LogObject.OptionalField<string> = undefined;
  public "error.id": LogObject.OptionalField<string> = undefined;
  public "error.message": LogObject.OptionalField<string> = undefined;
  public "error.stack_trace": LogObject.OptionalField<string> = undefined;
  public "service.name": LogObject.OptionalField<string> = undefined;
  public "service.version": LogObject.OptionalField<string> = undefined;
  public "service.environment": LogObject.OptionalField<string> = undefined;
  public "service.id": LogObject.OptionalField<string> = undefined;
  readonly "process.args" = Deno.args;
  public "event.duration": LogObject.OptionalField<number> = undefined;
  public "http.version": LogObject.OptionalField<string> = undefined;
  public "http.request.id": LogObject.OptionalField<string> = undefined;
  public "http.request.method": LogObject.OptionalField<string> = undefined;
  public "http.request.mime_type": LogObject.OptionalField<string> = undefined;
  public "http.request.referrer": LogObject.OptionalField<string> = undefined;
  public "http.request.url.original": LogObject.OptionalField<string> =
    undefined;
  public "http.response.mime_type": LogObject.OptionalField<string> = undefined;
  public "http.response.status_code": LogObject.OptionalField<number> =
    undefined;

  constructor(
    error?: LogObject.Error,
    request?: LogObject.Request,
    response?: LogObject.Response,
  ) {
    this.#error = error;
    this.#request = request;
    this.#response = response;

    if (this.#error) {
      this.setErrorFields(this.#error);
    }

    if (this.#request) {
      this.setRequestFields(this.#request);
    }

    if (this.#response) {
      this.setResponseFields(this.#response);
    }
  }

  public setBaseFields(
    message: string,
    data?: Array<unknown>,
    labels?: Record<string, string>,
    tags?: Array<string>,
  ) {
    this.message = message;
    this.data = data;
    this.labels = labels;
    this.tags = tags;

    return this;
  }

  public setErrorFields(error: LogObject.Error) {
    if (error instanceof Error) {
      this["error.id"] = error.name;
      this["error.message"] = error.message;
      this["error.stack_trace"] = getStackTrace(error).join(", ");
    } else {
      this["error.code"] = error.code;
      this["error.id"] = error.id;
      this["error.message"] = error.title;
      this["error.message"] = getStackTrace().join("\n");
      this["error.stack_trace"] = getStackTrace().join(", ");
    }

    return this;
  }

  public setLogFields(level: string, logger: string) {
    const origin = getLastFileStack(
      this.#error instanceof Error ? this.#error : undefined,
    );

    this["log.level"] = level as Logger.LevelName;
    this["log.logger"] = logger;
    this["log.origin.file.column"] = origin.column;
    this["log.origin.file.line"] = origin.line;
    this["log.origin.file.name"] = origin.filename;
    this["log.origin.file.path"] = origin.path;

    return this;
  }

  public setRequestFields(request: LogObject.Request) {
    this["http.version"] = request.httpVersion;
    this["http.request.id"] = request.id;
    this["http.request.method"] = request.method;
    this["http.request.mime_type"] = request.get("content-type");
    this["http.request.referrer"] = request.get("referrer");
    this["http.request.url.original"] = request.originalUrl;

    return this;
  }

  public setResponseFields(response: LogObject.Response) {
    this["event.duration"] = response.duration || 0.1;
    this["http.response.mime_type"] = response.get("content-type");
    this["http.response.status_code"] = response.statusCode;

    return this;
  }

  public setServiceFields(
    environment: string,
    name?: string,
    version?: string,
    id?: string,
  ) {
    this["service.environment"] = environment;
    this["service.name"] = name;
    this["service.version"] = version;
    this["service.id"] = id;

    return this;
  }
}

type LogOptions = {
  message: string;
  args?: unknown[];
  error?: LogObject.Error;
  request?: LogObject.Request;
  response?: LogObject.Response;
};

abstract class BaseLogger {
  public settings: Logger.DefaultSettings;

  constructor(settings: Logger.Settings) {
    this.settings = LoggerSettingsSchema.parse(settings);
  }

  protected abstract format(logObject: LogObject): string;

  protected isSilentMode(severity: LoggerSeverity) {
    return this.settings.severity === 0 || severity < this.settings.severity;
  }

  protected log(
    severity: LoggerSeverity,
    level: Logger.LevelName,
    options: LogOptions,
  ) {
    let loggerName = this.settings.application;

    if (this.settings.module) {
      loggerName += `:${this.settings.module}`;
    }

    const logObject = new LogObject(
      options.error,
      options.request,
      options.response,
    )
      .setBaseFields(options.message, options.args)
      .setLogFields(level, loggerName)
      .setServiceFields(
        this.settings.environment,
        this.settings.application,
        this.settings.version,
        this.settings.id,
      );

    const formatted = this.format(logObject);

    if (this.isSilentMode(severity)) {
      this.settings.transports[SeverityName.Silent](formatted);
    } else {
      const severityName = LoggerSeverity[severity] as Logger.SeverityName;
      const transport = this.settings.transports[severityName];

      transport(formatted);
    }

    return logObject;
  }

  public debug(message: string, ...args: unknown[]) {
    return this.log(LoggerSeverity.Debug, Level.Debug, { message, args });
  }

  public info(message: string, ...args: unknown[]) {
    return this.log(LoggerSeverity.Informational, Level.Info, {
      message,
      args,
    });
  }

  public http(request: LogObject.Request, response: LogObject.Response) {
    return this.log(LoggerSeverity.Informational, Level.Http, {
      request,
      response,
      message: "",
    });
  }

  public warn(message: string, ...args: unknown[]) {
    return this.log(LoggerSeverity.Warning, Level.Warn, { message, args });
  }

  public error(message: string, ...args: unknown[]) {
    const [error] = args;

    return this.log(LoggerSeverity.Error, Level.Error, {
      message,
      args,
      error: error as LogObject.Error,
    });
  }
}

class PrettyLogger extends BaseLogger {
  protected inspect(data: unknown) {
    return Deno.inspect(data, this.settings.inspectOptions);
  }

  protected prettifyStack(value: string) {
    return ansicolors.yellow(`  • ${ansicolors.underline(value)}`);
  }

  protected substitute(
    value: string,
    substitutions: Record<string, any>,
  ): string {
    const regex = /{(.+?)\}/g;

    return value.replace(regex, (match: string, _index: number) => {
      const key = match.replace("{", "").replace("}", "");
      const substitution = substitutions[key];

      return substitution ? substitution : match;
    });
  }

  protected applyTemplate(template: string, log: LogObject) {
    const args = log.data
      ? log.data.map(this.inspect.bind(this)).join("\n")
      : "";
    const stack = log["error.stack_trace"]
      ? log["error.stack_trace"].split(", ").map(this.prettifyStack).join("\n")
      : "";

    if (args) {
      template = template.replaceAll("{data}", `\n${args}`);
    }

    if (stack) {
      template = template.replaceAll("{error.stack_trace}", `\n${stack}`);
    }

    return this.substitute(template, log);
  }

  protected getStatusColor(status: number) {
    if (isErrorStatus(status)) {
      return HttpStatusTheme.Error;
    }

    if (isSuccessfulStatus(status)) {
      return HttpStatusTheme.Successful;
    }

    if (isInformationalStatus(status)) {
      return HttpStatusTheme.Informational;
    }

    if (isRedirectStatus(status)) {
      return HttpStatusTheme.Redirection;
    }

    return HttpStatusTheme.Default;
  }

  protected getPrettyTemplate(level: Logger.LevelName, status?: number) {
    const spaces = " ".repeat(this.settings.padding - level.length);
    let template = level === "HTTP"
      ? this.settings.prettyHttpTemplate
      : level === "ERROR"
      ? this.settings.prettyErrorTemplate
      : this.settings.prettyTemplate;

    if (status) {
      template = template.replaceAll(
        "{http.response.status_code}",
        this.getStatusColor(status)("{http.response.status_code}"),
      );
    }

    return template.replaceAll(
      "{log.level}",
      Theme[level](`{log.level}${spaces}`),
    );
  }

  protected format(logObject: LogObject) {
    return this.applyTemplate(
      this.getPrettyTemplate(
        logObject["log.level"],
        logObject["http.response.status_code"],
      ),
      logObject,
    );
  }
}

class JsonLogger extends BaseLogger {
  protected format(logObject: LogObject) {
    return JSON.stringify(logObject, null, 2);
  }
}

// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export namespace Logger {
  export type LevelName = (typeof Level)[keyof typeof Level];

  export type SeverityName = (typeof SeverityName)[keyof typeof SeverityName];

  export type Settings = z.input<typeof LoggerSettingsSchema>;

  export type DefaultSettings = z.output<typeof LoggerSettingsSchema>;

  export const Severity = LoggerSeverity;
}

export type Logger = BaseLogger;

export function createLogger(settings: Logger.Settings) {
  return settings.mode === "pretty"
    ? new PrettyLogger(settings)
    : new JsonLogger(settings);
}

// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function getLastFileStack(error = new Error()) {
  const stack = error.stack as string;
  const files = stack.split("\n").filter(isFileLine);

  return getStackDetails(formatStackLine(files[files.length - 1].trim()));
}

function getStackTrace(error = new Error()) {
  const stack = error.stack as string;

  return formatStackTrace(stack);
}

function formatStackTrace(stack: string) {
  return stack.split("\n").filter(isFileLine).map(trim).map(formatStackLine);
}

function isFileLine(line: string) {
  return line.includes("file://") && !line.includes("node_modules/");
}

function trim(value: string) {
  return value.trim();
}

function formatStackLine(line: string) {
  const cwd = `${Deno.cwd()}/`;
  const endIndex = line.indexOf(cwd);

  return line.substring(endIndex).replace(cwd, "").replaceAll(")", "");
}

function getStackDetails(stack: string) {
  const parts = stack.split(":");
  const fileParts = parts[0].split("/");
  const filename = fileParts[fileParts.length - 1];

  return {
    column: Number(parts[2]),
    line: Number(parts[1]),
    filename,
    path: parts[0],
  };
}

function doNothing(..._: unknown[]) {
  return;
}

// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
namespace LogObject {
  export type Error = {
    code?: string;
    id?: string;
    message?: string;
    name?: string;
    stack?: string;
    title?: string;
  };

  export type Request = {
    httpVersion?: string;
    id?: string;
    method?: string;
    get: (value: string) => string | undefined;
    originalUrl?: string;
  };

  export type Response = {
    duration?: number;
    get: (value: string) => string | undefined;
    statusCode?: number;
  };

  export type OptionalField<T> = T | undefined;
}
// #endregion
