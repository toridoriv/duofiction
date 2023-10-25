import { mongodb } from "@modules/database/deps.ts";
import {
  type BaseDocument,
  createDocument,
  createDocuments,
  type DocumentSchema,
  type MongoDocument,
} from "@modules/database/document.ts";
import type { Query } from "@modules/database/queries.ts";
import type { ToDotNotation } from "@modules/typings/mod.ts";

export type Collection<T extends BaseDocument> = ReturnType<
  typeof createCollection<T>
>;

export function createCollection<T extends BaseDocument>(
  collection: mongodb.Collection,
) {
  type CollectionDocument = DocumentSchema<T>;
  type CollectionQuery = Query<CollectionDocument>;
  type FindOptions = Query.FindOptions<T>;
  type DocumentInDotNotation = ToDotNotation<CollectionDocument>;

  const $collection = collection as unknown as mongodb.Collection<
    MongoDocument
  >;

  function findById<O extends FindOptions>(id: string, options?: O) {
    return $collection.findOne(
      { _id: new mongodb.UUID(id) },
      // @ts-ignore: ¯\_(ツ)_/¯
      options,
    ) as Promise<Query.InferFindReturn<CollectionDocument, O> | null>;
  }

  function findOne<Q extends CollectionQuery, O extends FindOptions>(
    query: Q,
    options?: O,
  ) {
    // @ts-ignore: ¯\_(ツ)_/¯
    return $collection.findOne(query, options) as Promise<
      Query.InferFindReturn<
        CollectionDocument,
        O
      > | null
    >;
  }

  function find<Q extends CollectionQuery, O extends FindOptions>(
    query: Q,
    options?: O,
  ) {
    // @ts-ignore: ¯\_(ツ)_/¯
    return $collection.find(query, options) as mongodb.FindCursor<
      Query.InferFindReturn<CollectionDocument, O>
    >;
  }

  function countDocuments<Q extends CollectionQuery>(
    query: Q,
    options?: mongodb.CountDocumentsOptions,
  ) {
    return $collection.countDocuments(query, options);
  }

  function deleteById(id: string, options?: mongodb.DeleteOptions) {
    return $collection.deleteOne({ _id: new mongodb.UUID(id) }, options);
  }

  function deleteMany<Q extends CollectionQuery>(
    query: Q,
    options?: mongodb.DeleteOptions,
  ) {
    return $collection.deleteMany(query, options);
  }

  async function insertOne(data: T, options?: mongodb.InsertOneOptions) {
    const document = createDocument(data);
    const result = await $collection.insertOne(document, options);

    return { document, result };
  }

  function insertMany(data: T[], options?: mongodb.BulkWriteOptions) {
    const documents = createDocuments(data);

    return $collection.insertMany(documents, options);
  }

  function updateById<O extends Query.UpdateOptions<T>>(
    id: string,
    update: Query.Update<T>,
    options?: O,
  ) {
    if (!options) {
      options = {} as O;
    }

    return $collection.findOneAndUpdate(
      { _id: new mongodb.UUID(id) },
      {
        $set: { updated_at: new Date() },
        ...(update as mongodb.UpdateFilter<MongoDocument>),
      },
      { returnDocument: "after", upsert: false, ...options },
    ) as Promise<Query.InferFindReturn<CollectionDocument, O> | null>;
  }

  function distinct<K extends keyof DocumentInDotNotation>(key: K) {
    // @ts-ignore: ¯\_(ツ)_/¯
    return $collection.distinct(key) as Promise<DocumentInDotNotation[K][]>;
  }

  return {
    get collectionName() {
      return $collection.collectionName;
    },
    countDocuments,
    deleteById,
    deleteMany,
    distinct,
    find,
    findById,
    findOne,
    insertOne,
    insertMany,
    updateById,
  };
}
