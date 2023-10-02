import { z } from "@deps";
import { LanguageCodeSchema, LanguageNameSchema } from "../language/mod.ts";
import { MultiChapter, OneShot } from "./chapter.ts";
import { Localization } from "./localization.ts";

export namespace Fanfiction {
  type schema = typeof Fanfiction.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface Fanfiction extends Fanfiction.output {}

export class Fanfiction {
  static readonly schema = z.object({
    id: z.string().uuid().default(createUuid),
    created_at: z.coerce.date().default(createTimestamp),
    updated_at: z.coerce.date().default(createTimestamp),
    kind: z.literal("fanfiction").default("fanfiction").catch("fanfiction"),
    origin_id: z.coerce.string().min(1),
    origin_url: z.string().url(),
    language: LanguageNameSchema,
    language_code: LanguageCodeSchema,
    title: Localization.schema.transform(Localization.parse),
    summary: Localization.schema.transform(Localization.parse),
    fandom: z.string(),
    relationship: z.array(z.string().min(1)).default([]),
    is_romantic: z.boolean().default(true),
    is_one_shot: z.boolean(),
    chapters: z.array(MultiChapter.schema).transform(toMultiChapter).or(
      z.array(OneShot.schema).transform(toOneShot),
    ).default([]),
  });

  public static create(properties: Fanfiction.input) {
    return new Fanfiction(properties);
  }

  public static parse(properties: Fanfiction.output) {
    return new Fanfiction(properties);
  }

  constructor(properties: Fanfiction.input | Fanfiction.output) {
    Object.assign(this, Fanfiction.schema.parse(properties));
  }

  public validate() {
    Object.assign(this, Fanfiction.schema.parse(this));
  }

  public getValidation() {
    return Fanfiction.schema.safeParse(this);
  }

  public isValid() {
    return Fanfiction.schema.safeParse(this).success;
  }
}

function toOneShot(value: OneShot.output[]) {
  return value.map(OneShot.parse);
}

function toMultiChapter(value: MultiChapter.output[]) {
  return value.map(MultiChapter.parse);
}

function createTimestamp() {
  return new Date();
}

function createUuid() {
  return globalThis.crypto.randomUUID();
}
