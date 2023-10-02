import { z } from "@deps";
import { LanguageCodeByName, LanguageNameByCode } from "./data.ts";

export const LanguageCodeSchema = z.nativeEnum(LanguageCodeByName);

export const LanguageNameSchema = z.nativeEnum(LanguageNameByCode);

export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export type LanguageName = z.infer<typeof LanguageNameSchema>;
