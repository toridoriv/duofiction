import {
  BSON,
  Collection,
  DatabaseClient,
  Fanfictions,
  Filter,
  FindOptions,
  UpdateFilter,
  UpdateOptions,
} from "@deps";
import { mainLogger } from "./logger.ts";
import {
  FanfictionInput,
  FanfictionInputSchema,
  FanfictionOutputSchema,
  toUuid,
  UnsafeFanfictionOutputSchema,
} from "@utils";

const uri = Deno.env.get("MONGODB_URI") || "mongodb://localhost/duofictiondb";

export const databaseClient = new DatabaseClient(uri, {
  logger: mainLogger.getSubLogger({ namespace: "database" }),
}).registerCollection<FanfictionDocument, "fanfictions">("fanfictions");

export interface FanfictionDocument extends Fanfictions.Fanfiction.output {
  _id: BSON.UUID;
}

export type FanfictionCollection = Collection<FanfictionDocument>;

export class FanfictionRepository {
  private logger = mainLogger.getSubLogger({
    namespace: "fanfictions-repository",
  });

  constructor(
    public collection: FanfictionCollection,
  ) {}

  protected registerOperation(operation: string, result: unknown) {
    return this.logger.debug(`Executed: ${operation}`, { result });
  }

  protected parseId(id: DocumentId) {
    if (typeof id === "string") {
      return toUuid(id);
    }

    return id;
  }

  async create(data: FanfictionInput) {
    const document = FanfictionInputSchema.parse(data);
    const result = await this.collection.insertOne(document);

    this.registerOperation("insert one", result);

    return FanfictionOutputSchema.parse(document);
  }

  async retrieve(
    id: DocumentId,
    options: FanfictionQueryOptions = { projection: {} },
  ) {
    options.projection._id = 0;

    const _id = this.parseId(id);

    const document = await this.collection.findOne({ _id }, options);
    const wasFound = document !== null;

    this.registerOperation("find one", {
      outcome: wasFound ? "found" : "not-found",
      id,
    });

    if (document === null) {
      return null;
    }

    return UnsafeFanfictionOutputSchema.parse(document);
  }

  async delete(id: DocumentId) {
    const _id = this.parseId(id);
    const result = await this.collection.deleteOne({ _id });

    this.registerOperation("delete one", result);

    return result;
  }

  async list(
    query: FanfictionQuery,
    options: FanfictionQueryOptions = { projection: {} },
  ) {
    options.projection._id = 0;

    const documents = await this.collection.find(query, options).map(
      UnsafeFanfictionOutputSchema.parse,
    ).toArray();

    this.registerOperation("find", { total: documents.length });

    return documents;
  }

  /**
   * Update a single document in a collection.
   *
   * @param query - The filter used to select the document to update
   * @param update - The update operations to be applied to the document
   * @param options - Optional settings for the command
   */
  async update(
    id: DocumentId,
    update: FanfictionUpdate = { $set: {} },
    options?: UpdateOptions,
  ) {
    if (update.$set) {
      Object.assign(update.$set, { updated_at: new Date() });
    } else {
      Object.assign(update, { $set: { updated_at: new Date() } });
    }

    const _id = this.parseId(id);
    const result = await this.collection.updateOne({ _id }, update, options);

    this.registerOperation("update one", result);

    return result;
  }
}

export type DocumentId = string | BSON.UUID;

export type FanfictionQuery = Filter<FanfictionDocument>;
export type FanfictionQueryOptions =
  & Omit<FindOptions<FanfictionDocument>, "projection">
  & {
    projection: Partial<Record<keyof FanfictionDocument, 0 | 1>>;
  };

export type FanfictionUpdate = UpdateFilter<FanfictionDocument>;

type SetRequired<T, K extends keyof T> = T & Pick<Required<T>, K>;
