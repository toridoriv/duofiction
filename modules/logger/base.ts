import {
  HttpStatusTheme,
  LevelName,
  Settings,
  SettingsInput,
  SettingsSchema,
  SeverityLevel,
  SeverityName,
  SeverityNameByLevel,
  Theme,
} from "@modules/logger/settings.ts";
import { LogObject } from "@modules/logger/log-object.ts";
import {
  ansicolors,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isSuccessfulStatus,
} from "@modules/logger/deps.ts";
import { SafeAny } from "@modules/typings/mod.ts";
import { Logger } from "https://deno.land/std@0.97.0/log/mod.ts";

type LogOptions = {
  message: string;
  args?: unknown[];
  error?: LogObject.Error;
  request?: LogObject.Request;
  response?: LogObject.Response;
};

abstract class BaseLogger {
  public settings: Settings;
  public severityLevel: SeverityLevel;

  constructor(settings: SettingsInput) {
    this.settings = SettingsSchema.parse(settings);
    this.severityLevel = SeverityLevel[this.settings.severity];
  }

  protected abstract format(logObject: LogObject): string;

  protected isSilentMode(severity: SeverityLevel) {
    if (this.settings.severity === SeverityName.Silent) {
      return true;
    }

    return severity < this.severityLevel;
  }

  protected log(
    severity: SeverityLevel,
    level: LevelName,
    options: LogOptions,
  ) {
    if (this.isSilentMode(severity)) {
      return new LogObject();
    }

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
    const transport = this.settings.transports[SeverityNameByLevel[severity]];

    transport(formatted);

    return logObject;
  }

  public debug(message: string, ...args: unknown[]) {
    return this.log(SeverityLevel.DEBUG, LevelName.Debug, { message, args });
  }

  public info(message: string, ...args: unknown[]) {
    return this.log(SeverityLevel.INFORMATIONAL, LevelName.Info, {
      message,
      args,
    });
  }

  public http(request: LogObject.Request, response: LogObject.Response) {
    return this.log(SeverityLevel.INFORMATIONAL, LevelName.Http, {
      request,
      response,
      message: "",
    });
  }

  public warn(message: string, ...args: unknown[]) {
    return this.log(SeverityLevel.WARNING, LevelName.Warn, { message, args });
  }

  public error(message: string, ...args: unknown[]) {
    const [error] = args;

    return this.log(SeverityLevel.ERROR, LevelName.Error, {
      message,
      args,
      error: error as LogObject.Error,
    });
  }
}

export class PrettyLogger extends BaseLogger {
  protected inspect(data: unknown) {
    return Deno.inspect(data, this.settings.inspectOptions);
  }

  protected prettifyStack(value: string) {
    return ansicolors.yellow(`  • ${ansicolors.underline(value)}`);
  }

  protected substitute(
    value: string,
    substitutions: Record<string, SafeAny>,
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

export class JsonLogger extends BaseLogger {
  protected format(logObject: LogObject) {
    return JSON.stringify(logObject, null, 2);
  }
}
