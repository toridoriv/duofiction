import {
  TextOutput,
  TextWithTranslationsOutput,
} from "@modules/fanfiction/texts.ts";

export function getTextToDisplay(text: TextOutput | TextOutput[]) {
  if (typeof text === "undefined") {
    return;
  }

  if (Array.isArray(text)) {
    if (text.length === 0) {
      return;
    }

    return text[0].rich || text[0].raw;
  }

  return text.rich || text.raw;
}

export function getMainTranslation(localized: TextWithTranslationsOutput) {
  return localized.translations[0];
}

export function hasMainTranslation(localized: TextWithTranslationsOutput) {
  return localized.translations[0] !== undefined;
}
