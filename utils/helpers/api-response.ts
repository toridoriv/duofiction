import { Status } from "@utils/mod.ts";
import config from "@modules/config/mod.ts";

export type ApiResponseBodyOk<
  T,
  Meta extends ApiResponseMetadata = ApiResponseMetadata,
> = {
  $metadata: Meta;
  status: Status;
  status_text: string;
  data: T;
  errors: null;
};

export type ApiResponseBodyNotOk = {
  $metadata: ApiResponseMetadata;
  status: Status;
  status_text: string;
  data: null;
  errors: Error[];
};

export type ApiResponseMetadata = {
  version: string;
  count: number;
};

export type ApiResponsePaginatedMetadata = ApiResponseMetadata & {
  total: number;
  size: number;
  offset: number;
};

export class ApiResponse<
  T,
  Meta extends ApiResponseMetadata = ApiResponseMetadata,
> extends Response {
  #metadata: Meta;

  constructor(body: T | Error[], init?: ResponseInit) {
    super(JSON.stringify(body), init);

    this.#metadata = {
      version: config.VERSION,
      count: Array.isArray(body) ? body.length : 1,
    } as Meta;
  }

  public setMetadata(metadata: Partial<Meta>) {
    this.#metadata = { ...this.#metadata, ...metadata };

    return this;
  }

  async error(): Promise<ApiResponseBodyNotOk> {
    const errors = await Response.prototype.json.call(this);

    return {
      $metadata: this.#metadata,
      status: this.status as Status,
      status_text: this.statusText,
      data: null,
      errors,
    };
  }

  async json(): Promise<ApiResponseBodyOk<T, Meta>> {
    const data = await Response.prototype.json.call(this);

    return {
      $metadata: this.#metadata,
      status: this.status as Status,
      status_text: this.statusText,
      data,
      errors: null,
    };
  }
}

export function getJsonHeaders() {
  const headers = new Headers();

  headers.set("content-type", "application/json");

  return headers;
}
