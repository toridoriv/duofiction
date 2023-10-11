import {
  getAuthorTag,
  getFandomTag,
  getLanguageTag,
  getOriginTag,
  getRelationshipTag,
  type LiteFanfictionOutput,
  type Tag,
  type TextOutput,
  type TextWithTranslationsOutput,
} from "@common";

export function getTags(fanfiction: LiteFanfictionOutput) {
  const tags: Tag[] = [getAuthorTag(fanfiction.author.name)];

  if (fanfiction.fandom) {
    tags.push(getFandomTag(fanfiction.fandom));
  }

  if (fanfiction.relationship) {
    tags.push(getRelationshipTag(fanfiction.relationship));
  }

  tags.push(getLanguageTag(fanfiction.language_code));
  tags.push(getOriginTag(fanfiction.source));

  return tags;
}

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

export function isCurrentPage(page: number) {
  const currentPage = window.location.pathname.split("/").reverse()[0];

  return Number(currentPage) === page;
}
