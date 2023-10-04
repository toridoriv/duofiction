import { Fanfictions } from "@deps";

export function getTextToDisplay(text: Fanfictions.Text | Fanfictions.Text[]) {
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

export function getMainTranslation(localized: Fanfictions.Localization) {
  return localized.translations[0];
}
