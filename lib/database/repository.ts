import { BSON, Collection, Db, Filter, OptionalUnlessRequiredId } from "@deps";

export namespace Repository {
  export type GenericOutput = { id: string };

  export interface Constructor<T extends GenericOutput = GenericOutput> {
    // deno-lint-ignore no-explicit-any
    new (value: any): T;
    // deno-lint-ignore no-explicit-any
    create(value: any): T;
  }
}

export class Repository<
  T extends Repository.GenericOutput,
  C extends Repository.Constructor<T>,
> {
  readonly collection: Collection<T>;

  constructor(
    readonly kind: string,
    readonly factory: C,
    db: Db,
  ) {
    this.collection = db.collection(kind);
  }

  public async insertOne(value: ConstructorParameters<C>[0]) {
    const resource = this.factory.create(value);

    await this.collection.insertOne(
      setMongoId(resource) as OptionalUnlessRequiredId<T>,
    );

    hideMongoId(resource);

    return resource;
  }

  public async findById(id: string) {
    const filter = {
      _id: new BSON.UUID(id),
    } as Filter<T>;

    const resource = (await this.collection.findOne(filter)) as T;

    if (resource === null) {
      return null;
    }

    hideMongoId(resource);

    return resource;
  }

  public async findByQuery(query: Filter<T>, limit = 10, skip = 0) {
    const resources = await this.collection
      .find(query)
      .limit(limit)
      .skip(skip)
      .toArray();

    return resources.map(hideMongoId);
  }
}

function hideMongoId<T extends Repository.GenericOutput>(value: T) {
  Object.defineProperty(value, "_id", {
    enumerable: false,
  });

  return value;
}

function setMongoId<T extends Repository.GenericOutput>(value: T) {
  Object.defineProperty(value, "_id", {
    value: new BSON.UUID(value.id),
    enumerable: true,
    writable: true,
    configurable: true,
  });

  return value;
}
