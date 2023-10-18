import { LanguageCode } from "@modules/localization/mod.ts";
import { FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";

export enum FanfictionTagName {
  Relationship = "relationship",
  Fandom = "fandom",
  Language = "language",
  Origin = "origin",
  Author = "author",
}

export const QUERY_BY_TAG_NAME = Object.freeze({
  [FanfictionTagName.Relationship]: "relationship=",
  [FanfictionTagName.Fandom]: "fandom=",
  [FanfictionTagName.Language]: "language_code=",
  [FanfictionTagName.Origin]: "origin=",
  [FanfictionTagName.Author]: "author=",
});

export const ICON_BY_TAG_NAME = Object.freeze({
  [FanfictionTagName.Relationship]: "user-group",
  [FanfictionTagName.Fandom]: "scroll",
  [FanfictionTagName.Language]: "globe",
  [FanfictionTagName.Origin]: "link",
  [FanfictionTagName.Author]: "user",
});

export interface FanfictionTag {
  icon: string;
  name: FanfictionTagName;
  value: string;
  href: string;
  total?: number;
}

function getTag<T extends number | undefined>(
  name: FanfictionTagName,
  value: string,
  total?: T,
) {
  return {
    name,
    icon: ICON_BY_TAG_NAME[name],
    value,
    href: getTagHref(name, value),
    total,
  };
}

export function getAllTags(fanfiction: FanfictionAttributesOutput) {
  const tags: Omit<FanfictionTag, "total">[] = [
    getAuthorTag(fanfiction.author.name),
  ];

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

export function getLanguageTag<T extends number | undefined>(
  code: LanguageCode,
  total?: T,
): FanfictionTag {
  return getTag(FanfictionTagName.Language, code, total);
}

export function getOriginTag(origin: string, total?: number): FanfictionTag {
  return getTag(FanfictionTagName.Origin, origin, total);
}

export function getFandomTag(fandom: string, total?: number): FanfictionTag {
  return getTag(FanfictionTagName.Fandom, fandom, total);
}

export function getRelationshipTag(
  relationship: string,
  total?: number,
): FanfictionTag {
  return getTag(
    FanfictionTagName.Relationship,
    relationship,
    total,
  );
}

export function getAuthorTag(authorName: string, total?: number) {
  return getTag(FanfictionTagName.Author, authorName, total);
}

function getTagHref(name: FanfictionTagName, value: string) {
  return `/catalog?${QUERY_BY_TAG_NAME[name]}${
    value.replaceAll("/", ",").replaceAll(" ", "%20")
  }`;
}
