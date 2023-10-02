export class BaseError extends Error {
  constructor(
    readonly detail: string,
    readonly code: string,
    readonly source?: Record<string, string>,
  ) {
    super();
  }
}

export class ValidationError extends BaseError {
}

export class NotFoundError extends BaseError {
  constructor(detail: string, readonly source?: Record<string, string>) {
    super(detail, "4000", source);
  }
}

export class MethodNotAllowed extends BaseError {
  constructor(detail: string, readonly source?: Record<string, string>) {
    super(detail, "4001", source);
  }
}

export class Unauthorized extends BaseError {
  constructor(detail: string, readonly source?: Record<string, string>) {
    super(detail, "4002", source);
  }
}

export class UnknownFetchError extends BaseError {
  constructor(detail: string, readonly source?: Record<string, string>) {
    super(detail, "5000", source);
  }
}
