import { format } from "@deps";

export namespace Log {
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

export class Log {
  #error?: Log.Error;
  #request?: Log.Request;
  #response?: Log.Response;

  readonly "@timestamp" = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
  public "log.level" = "";
  public message = "";
  public data: Log.OptionalField<Array<unknown>> = undefined;
  public labels: Log.OptionalField<Record<string, string>> = undefined;
  public tags: Log.OptionalField<string[]> = undefined;
  public "log.logger" = "unknown";
  public "log.origin.file.column" = 0;
  public "log.origin.file.line" = 0;
  public "log.origin.file.name" = "";
  public "log.origin.file.path" = "";
  public "error.code": Log.OptionalField<string> = undefined;
  public "error.id": Log.OptionalField<string> = undefined;
  public "error.message": Log.OptionalField<string> = undefined;
  public "error.stack_trace": Log.OptionalField<string> = undefined;
  public "service.name": Log.OptionalField<string> = undefined;
  public "service.version": Log.OptionalField<string> = undefined;
  public "service.environment": Log.OptionalField<string> = undefined;
  public "service.id": Log.OptionalField<string> = undefined;
  readonly "process.args" = Deno.args;
  public "event.duration": Log.OptionalField<number> = undefined;
  public "http.version": Log.OptionalField<string> = undefined;
  public "http.request.id": Log.OptionalField<string> = undefined;
  public "http.request.method": Log.OptionalField<string> = undefined;
  public "http.request.mime_type": Log.OptionalField<string> = undefined;
  public "http.request.referrer": Log.OptionalField<string> = undefined;
  public "http.request.url.original": Log.OptionalField<string> = undefined;
  public "http.response.mime_type": Log.OptionalField<string> = undefined;
  public "http.response.status_code": Log.OptionalField<number> = undefined;

  constructor(
    error?: Log.Error,
    request?: Log.Request,
    response?: Log.Response,
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

  public setErrorFields(error: Log.Error) {
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

    this["log.level"] = level;
    this["log.logger"] = logger;
    this["log.origin.file.column"] = origin.column;
    this["log.origin.file.line"] = origin.line;
    this["log.origin.file.name"] = origin.filename;
    this["log.origin.file.path"] = origin.path;

    return this;
  }

  public setRequestFields(request: Log.Request) {
    this["http.version"] = request.httpVersion;
    this["http.request.id"] = request.id;
    this["http.request.method"] = request.method;
    this["http.request.mime_type"] = request.get("content-type");
    this["http.request.referrer"] = request.get("referrer");
    this["http.request.url.original"] = request.originalUrl;

    return this;
  }

  public setResponseFields(response: Log.Response) {
    this["event.duration"] = response.duration;
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
