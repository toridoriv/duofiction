import {
  encode,
  Hash,
  LanguageCodeSchema,
  LanguageNameSchema,
  z,
} from "@modules/fanfiction/deps.ts";

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

function createHash<T extends { hash: string; original: { raw: string } }>(
  value: T,
) {
  if (!value.hash) {
    value.hash = new Hash("md5").digest(encode(value.original.raw)).hex();
  }

  return value;
}
