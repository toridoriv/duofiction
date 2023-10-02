import { ansicolors } from "@deps";

export enum Severity {
  Silent = 0,
  Debug = 1,
  Informational = 2,
  Warning = 3,
  Error = 4,
}

export enum Mode {
  DEVELOPMENT = "DEVELOPMENT",
  PRODUCTION = "PRODUCTION",
}

export const Level = {
  Error: "ERROR",
  Warn: "WARN",
  Info: "INFO",
  Http: "HTTP",
  Debug: "DEBUG",
} as const;

export const Theme = {
  [Level.Error]: ansicolors.bold.red,
  [Level.Warn]: ansicolors.bold.yellow,
  [Level.Info]: ansicolors.bold.green,
  [Level.Http]: ansicolors.bold.cyan,
  [Level.Debug]: ansicolors.bold.blue,
};

export const HttpStatusTheme = {
  Informational: ansicolors.bold.cyan,
  Successful: ansicolors.bold.cyan,
  Redirection: ansicolors.bold.yellow,
  Error: ansicolors.bold.red,
  Default: ansicolors.bold,
};

export const LevelTransport = {
  [Severity.Silent]: doNothing,
  [Severity.Debug]: console.debug,
  [Severity.Informational]: console.info,
  [Severity.Warning]: console.warn,
  [Severity.Error]: console.error,
};

function doNothing(..._: unknown[]) {
  return;
}

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

export const DefaultSettings: Settings = {
  severity: Severity.Informational,
  mode: Mode.PRODUCTION,
  namespace: "unknown",
  padding: Level.Debug.length + 1,
  prettyTemplate,
  prettyErrorTemplate,
  prettyHttpTemplate,
  useColors: true,
};

export type LevelName = (typeof Level)[keyof typeof Level];

export type Settings = {
  severity: Severity;
  mode: Mode;
  namespace: string;
  id?: string;
  version?: string;
  application?: string;
  padding: number;
  prettyTemplate: string;
  prettyErrorTemplate: string;
  prettyHttpTemplate: string;
  useColors: boolean;
};
