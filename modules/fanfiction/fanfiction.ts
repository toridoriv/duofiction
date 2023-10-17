import {
  LanguageCodeSchema,
  LanguageNameSchema,
  z,
} from "@modules/fanfiction/deps.ts";
import { TextWithTranslationsSchema } from "@modules/fanfiction/texts.ts";
import { AuthorSchema } from "@modules/fanfiction/author.ts";
import { ChapterSchema } from "@modules/fanfiction/chapters.ts";

export type FanfictionAttributesInput = z.input<
  typeof FanfictionAttributesSchema
>;
export type FanfictionAttributesOutput = z.output<
  typeof FanfictionAttributesSchema
>;

export const RawFanfictionAttributesSchema = z.object({
  id: z.string().uuid().default(createUuid),
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

export const FanfictionAttributesSchema = RawFanfictionAttributesSchema
  .transform(setRelationship).transform(addSource);

export type FanfictionInput = z.input<typeof FanfictionSchema>;
export type FanfictionOutput = z.output<typeof FanfictionSchema>;

export const FanfictionSchema = RawFanfictionAttributesSchema.extend({
  kind: z.literal("fanfiction").default("fanfiction").catch("fanfiction"),
  chapters: z.array(ChapterSchema).default([]),
}).transform(setRelationship).transform(addSource);

function createUuid() {
  return globalThis.crypto.randomUUID();
}

function setRelationship<
  T extends { relationship_characters: string[]; relationship?: string },
>(value: T) {
  if (value.relationship_characters.length > 0) {
    value.relationship = value.relationship_characters.join("/");
  }

  return value;
}

function addSource<T extends { source?: string; origin_url: string }>(
  value: T,
) {
  if (!value.source) {
    value.source = new URL(value.origin_url).hostname;
  }

  return value;
}
