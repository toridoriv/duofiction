import { z } from "@modules/fanfiction/deps.ts";
import {
  ParagraphSchema,
  TextWithTranslationsSchema,
} from "@modules/fanfiction/texts.ts";

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
