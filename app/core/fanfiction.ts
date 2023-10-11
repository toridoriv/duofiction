import { encode, Hash, mongodb, z } from "@deps";
import { LanguageCodeSchema, LanguageNameSchema } from "./localization.ts";

export type AuthorInput = z.input<typeof AuthorSchema>;
export type AuthorOutput = z.output<typeof AuthorSchema>;

export const AuthorSchema = z.object({
  name: z.string().min(1).default("Anonymous"),
  url: z.string().url(),
});

export type TextInput = z.input<typeof TextSchema>;
export type TextOutput = z.output<typeof TextSchema>;

export const TextSchema = z.object({
  raw: z.string().min(1).trim(),
  rich: z.string().trim().default(""),
  language_code: LanguageCodeSchema,
  language: LanguageNameSchema,
});

export type TextWithTranslationsInput = z.input<
  typeof TextWithTranslationsSchema
>;
export type TextWithTranslationsOutput = z.output<
  typeof TextWithTranslationsSchema
>;

export const TextWithTranslationsSchema = z.object({
  original: TextSchema,
  translations: z.array(TextSchema).default([]),
});

export type ParagraphInput = z.input<typeof ParagraphSchema>;
export type ParagraphOutput = z.output<typeof ParagraphSchema>;

export const ParagraphSchema = TextWithTranslationsSchema.extend({
  index: z.number().int(),
  hash: z.string().default(""),
}).transform(createHash);

export type OneShotInput = z.input<typeof OneShotSchema>;
export type OneShotOutput = z.output<typeof OneShotSchema>;

export const OneShotSchema = z.object({
  paragraphs: z.array(ParagraphSchema).default([]),
});

export type MultiChapterInput = z.input<typeof MultiChapterSchema>;
export type MultiChapterOutput = z.output<typeof MultiChapterSchema>;

export const MultiChapterSchema = z.object({
  title: TextWithTranslationsSchema,
  paragraphs: z.array(ParagraphSchema).default([]),
  summary: TextWithTranslationsSchema.nullable().default(null),
});

export type ChapterInput = z.input<typeof ChapterSchema>;
export type ChapterOutput = z.output<typeof ChapterSchema>;

export const ChapterSchema = z.union([OneShotSchema, MultiChapterSchema]);

export type LiteFanfictionInput = z.input<typeof LiteFanfictionSchema>;
export type LiteFanfictionOutput = z.output<typeof LiteFanfictionSchema>;

export const LiteFanfictionSchema = z.object({
  id: z.string().uuid().default(createUuid),
  created_at: z.coerce.date().default(createTimestamp),
  updated_at: z.coerce.date().default(createTimestamp),
  author: AuthorSchema,
  origin_id: z.coerce.string().min(1),
  origin_url: z.string().url(),
  source: z.string().default(""),
  language: LanguageNameSchema,
  language_code: LanguageCodeSchema,
  title: TextWithTranslationsSchema,
  summary: TextWithTranslationsSchema,
  fandom: z.string(),
  relationship_characters: z.array(z.string().min(1)).default([]),
  relationship: z.string().default(""),
  is_romantic: z.boolean().default(true),
  is_one_shot: z.boolean(),
});

export const RawFanfictionSchema = LiteFanfictionSchema.extend({
  kind: z.literal("fanfiction").default("fanfiction").catch("fanfiction"),
  chapters: z.array(ChapterSchema).default([]),
});

export type FanfictionInput = z.input<typeof FanfictionSchema>;
export type FanfictionOutput = z.output<typeof FanfictionSchema>;

export const FanfictionSchema = RawFanfictionSchema.transform(addSource)
  .transform(setRelationship);

export type FanfictionDocumentInput = z.input<typeof FanfictionDocumentSchema>;
export type FanfictionDocumentOutput = z.output<
  typeof FanfictionDocumentSchema
>;

export const FanfictionDocumentSchema = FanfictionSchema.transform(
  toFanfictionDocument,
);

function createHash<T extends { hash: string; original: { raw: string } }>(
  value: T,
) {
  if (!value.hash) {
    value.hash = new Hash("md5").digest(encode(value.original.raw)).hex();
  }

  return value;
}

function createUuid() {
  return globalThis.crypto.randomUUID();
}

function addSource<T extends { source?: string; origin_url: string }>(
  value: T,
) {
  if (!value.source) {
    value.source = new URL(value.origin_url).hostname;
  }

  return value;
}

function setRelationship<
  T extends { relationship_characters: string[]; relationship?: string },
>(value: T) {
  if (value.relationship_characters.length > 0) {
    value.relationship = value.relationship_characters.join("/");
  }

  return value;
}

function createTimestamp() {
  return new Date();
}

function toFanfictionDocument<T extends FanfictionOutput>(fanfiction: T) {
  return { ...fanfiction, _id: new mongodb.BSON.UUID(fanfiction.id) };
}
