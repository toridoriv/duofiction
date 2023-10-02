import {
  deepMerge,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isSuccessfulStatus,
} from "@deps";
import * as formatter from "./formatter.ts";
import { Log } from "./log.ts";
import {
  DefaultSettings,
  HttpStatusTheme,
  Level,
  LevelName,
  LevelTransport,
  Mode as LoggerMode,
  Settings,
  Severity,
  Theme,
} from "./settings.ts";

type LogOptions = {
  message: string;
  args?: unknown[];
  error?: Log.Error;
  request?: Log.Request;
  response?: Log.Response;
};

export namespace Logger {
  export type Mode = LoggerMode;

  export type Generic = Record<
    "debug" | "info" | "error" | "warn",
    // deno-lint-ignore no-explicit-any
    (...args: Array<unknown>) => any
  >;
}

export class Logger {
  static readonly Severity = Severity;
  static readonly Mode = LoggerMode;

  public static create(
    settings?: Partial<Settings>,
    transport?: typeof LevelTransport,
  ) {
    return new Logger(settings, transport);
  }

  readonly settings: Settings;
  readonly transport: typeof LevelTransport;

  constructor(settings: Partial<Settings> = {}, transport = LevelTransport) {
    this.settings = deepMerge<Settings>(DefaultSettings, settings);
    this.transport = transport;
  }

  protected log(severity: Severity, level: LevelName, options: LogOptions) {
    const logObject = new Log(options.error, options.request, options.response)
      .setBaseFields(options.message, options.args)
      .setLogFields(level, this.settings.namespace)
      .setServiceFields(
        this.settings.mode,
        this.settings.application,
        this.settings.version,
        this.settings.id,
      );

    const formatted = this.isProductionMode()
      ? formatter.json(logObject, this.settings.useColors)
      : formatter.pretty(
        this.getPrettyTemplate(level, options.response?.statusCode),
        logObject,
      );

    this.transport[severity](formatted);

    return logObject;
  }

  protected getPrettyTemplate(level: LevelName, status?: number) {
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

  protected isSilentMode(severity: Severity) {
    return this.settings.severity === 0 || severity < this.settings.severity;
  }

  protected isProductionMode() {
    return this.settings.mode === LoggerMode.PRODUCTION;
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

  public getSubLogger(
    settings: Partial<Settings> = {},
    transport = LevelTransport,
  ) {
    const namespace = `${this.settings.namespace}:${
      settings.namespace || "unknown"
    }`;
    const merged = deepMerge(
      // deno-lint-ignore no-explicit-any
      this.settings as any,
      settings,
    ) as unknown as Settings;

    merged.namespace = namespace;

    return new Logger(merged, transport);
  }

  public debug(message: string, ...args: unknown[]) {
    return this.log(Severity.Debug, Level.Debug, { message, args });
  }

  public info(message: string, ...args: unknown[]) {
    return this.log(Severity.Informational, Level.Info, { message, args });
  }

  public http(request: Log.Request, response: Log.Response) {
    return this.log(Severity.Informational, Level.Http, {
      request,
      response,
      message: "",
    });
  }

  public warn(message: string, ...args: unknown[]) {
    return this.log(Severity.Warning, Level.Warn, { message, args });
  }

  public error(message: string, ...args: unknown[]) {
    const [error] = args;

    return this.log(Severity.Error, Level.Error, {
      message,
      args,
      error: error as Log.Error,
    });
  }
}
