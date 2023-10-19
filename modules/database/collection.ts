import { mongodb } from "@modules/database/deps.ts";
import {
  BaseDocument,
  createDocument,
  createDocuments,
  DocumentSchema,
  MongoDocument,
} from "@modules/database/document.ts";
import { Query } from "@modules/database/queries.ts";

export type Collection<T extends BaseDocument> = ReturnType<
  typeof createCollection<T>
>;

export function createCollection<T extends BaseDocument>(
  collection: mongodb.Collection,
) {
  type CollectionDocument = DocumentSchema<T>;
  type CollectionQuery = Query<CollectionDocument>;
  type FindOptions = Query.FindOptions<T>;

  const $collection = collection as unknown as mongodb.Collection<
    MongoDocument
  >;

  function findById<O extends FindOptions>(id: string, options?: O) {
    return $collection.findOne(
      { _id: new mongodb.UUID(id) },
      options,
    ) as Promise<Query.InferFindReturn<CollectionDocument, O> | null>;
  }

  function findOne<Q extends CollectionQuery, O extends FindOptions>(
    query: Q,
    options?: O,
  ) {
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

    return $collection.findOneAndUpdate({ _id: new mongodb.UUID(id) }, {
      $set: { updated_at: new Date() },
      ...update as mongodb.UpdateFilter<MongoDocument>,
    }, { returnDocument: "after", upsert: false, ...options }) as Promise<
      Query.InferFindReturn<
        CollectionDocument,
        O
      > | null
    >;
  }

  return {
    get collectionName() {
      return $collection.collectionName;
    },
    countDocuments,
    deleteById,
    deleteMany,
    find,
    findById,
    findOne,
    insertOne,
    insertMany,
    updateById,
  };
}
