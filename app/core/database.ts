// deno-lint-ignore-file no-explicit-any ban-types
import { mongodb } from "@deps";

export interface DatabaseOptions extends mongodb.MongoClientOptions {
  logger: {
    info: (...args: any[]) => any;
    error: (...args: any[]) => any;
  };
}

export class DatabaseClient extends mongodb.MongoClient {
  readonly logger: DatabaseOptions["logger"];

  constructor(readonly uri: string, options: Partial<DatabaseOptions>) {
    const { logger, ...rest } = options;

    super(uri, rest as DatabaseOptions);

    this.logger = logger || console;

    this.on("open", () => {
      this.logger.info("Connected to the database.");
    });

    this.on("connectionClosed", () => {
      this.logger.info("Disconnected from the database.");
    });

    this.on("close", () => {
      this.logger.info("Disconnected from the database.");
    });

    this.on("error", (err) => {
      this.logger.error("There was an unexpected database error", err);
    });
  }

  public registerCollection<T extends Object, N extends string>(
    name: N,
  ) {
    const v = this as DatabasePipe<this, N, T>;

    Object.assign(v, { [name]: this.db().collection(name) });

    return v;
  }
}

type DatabasePipe<
  D extends DatabaseClient,
  N extends string,
  T extends Object,
> =
  & D
  & {
    [K in N]: mongodb.Collection<T>;
  };
