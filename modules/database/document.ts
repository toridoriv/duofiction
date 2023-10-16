import { mongodb } from "@modules/database/deps.ts";

export type BaseDocument = {
  id: string;
};

export type MongoDocument = {
  _id: mongodb.BSON.UUID;
  created_at: Date;
  updated_at: Date;
};

export type DocumentSchema<T extends BaseDocument> =
  & {
    [K in keyof MongoDocument]: MongoDocument[K];
  }
  & {
    [K in keyof T]: T[K];
  };

export function createDocument<T extends BaseDocument>(
  data: T,
): DocumentSchema<T> {
  const creationDate = new Date();

  return {
    _id: new mongodb.UUID(data.id),
    created_at: creationDate,
    updated_at: creationDate,
    ...data,
  };
}

export function createDocuments<T extends BaseDocument>(data: T[]) {
  return data.map(createDocument);
}
