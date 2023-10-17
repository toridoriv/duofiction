import { SafeAny } from "@modules/typings/utilities.ts";
import { mongodb } from "@modules/database/deps.ts";
import { Collection, createCollection } from "@modules/database/collection.ts";
import { BaseDocument } from "@modules/database/document.ts";

export interface ClientOptions extends mongodb.MongoClientOptions {
  logger: {
    info: (...args: SafeAny[]) => SafeAny;
    error: (...args: SafeAny[]) => SafeAny;
  };
}

export class Client extends mongodb.MongoClient {
  #isConnected = false;

  readonly logger: ClientOptions["logger"];

  constructor(readonly uri: string, options: Partial<ClientOptions>) {
    const { logger, ...rest } = options;

    super(uri, rest as ClientOptions);

    this.logger = logger || console;

    this.on("open", () => {
      this.logger.info("Connected to the database.");
      this.#isConnected = true;
    });

    this.on("close", () => {
      this.logger.info("Disconnected from the database.");
      this.#isConnected = false;
    });

    this.on("error", (err) => {
      this.logger.error("There was an unexpected database error", err);
    });
  }

  public get isConnected() {
    return this.#isConnected;
  }

  public close(force?: boolean): Promise<void> {
    this.emit("close");

    return mongodb.MongoClient.prototype.close.call(this, force);
  }

  public registerCollection<T extends BaseDocument, N extends string>(
    name: N,
    options?: mongodb.CollectionOptions,
  ) {
    const v = this as DatabasePipe<this, N, T>;
    const collection = createCollection<T>(this.db().collection(name, options));

    Object.assign(v, { [name]: collection });

    return v;
  }
}

type DatabasePipe<
  D extends Client,
  N extends string,
  T extends BaseDocument,
> =
  & D
  & {
    [K in N]: Collection<T>;
  };
