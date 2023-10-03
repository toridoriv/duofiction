import { type Fanfictions, type LanguageCode, LanguageNameByCode } from "@deps";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region

// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export enum TagName {
  Relationship = "relationship",
  Fandom = "fandom",
  Language = "language",
  Origin = "origin",
}

export const QUERY_BY_TAG_NAME = Object.freeze({
  [TagName.Relationship]: "relationship=",
  [TagName.Fandom]: "fandom=",
  [TagName.Language]: "language_code=",
  [TagName.Origin]: "origin=",
});

export const ICON_BY_TAG_NAME = Object.freeze({
  [TagName.Relationship]: "user-group",
  [TagName.Fandom]: "scroll",
  [TagName.Language]: "globe",
  [TagName.Origin]: "link",
});

export type Tag = {
  href: string;
  icon: typeof ICON_BY_TAG_NAME[TagName];
  name: TagName;
  value: string;
  total?: number;
};

export function getTagHref(name: TagName, ...values: string[]) {
  return `/fanfictions?${QUERY_BY_TAG_NAME[name]}${
    values.join(",").replaceAll(" ", "%20")
  }`;
}

export function getLanguageTag(
  code: LanguageCode,
  total?: number,
): Tag {
  return {
    name: TagName.Language,
    value: LanguageNameByCode[code],
    icon: ICON_BY_TAG_NAME[TagName.Language],
    href: getTagHref(TagName.Language, code),
    total,
  };
}

export function getOriginTag(origin: string, total?: number): Tag {
  return {
    name: TagName.Origin,
    value: origin,
    icon: ICON_BY_TAG_NAME[TagName.Origin],
    href: getTagHref(TagName.Origin, origin),
    total,
  };
}

export function getFandomTag(fandom: string, total?: number): Tag {
  return {
    name: TagName.Fandom,
    value: fandom,
    icon: ICON_BY_TAG_NAME[TagName.Fandom],
    href: getTagHref(TagName.Fandom, fandom),
    total,
  };
}

export function getRelationshipTag(
  relationship: string,
  total?: number,
): Tag {
  return {
    name: TagName.Relationship,
    value: relationship,
    icon: ICON_BY_TAG_NAME[TagName.Relationship],
    href: getTagHref(TagName.Relationship, relationship.replaceAll("/", ",")),
    total,
  };
}

export function getAllAvailableTagsForFanfiction(
  fanfiction: Fanfictions.Fanfiction.output,
): Tag[] {
  const tags: Tag[] = [];

  if (fanfiction.fandom) {
    tags.push(getFandomTag(fanfiction.fandom));
  }

  if (fanfiction.relationship) {
    tags.push(getRelationshipTag(fanfiction.relationship));
  }

  tags.push(getLanguageTag(fanfiction.language_code));

  const url = new URL(fanfiction.origin_url);

  tags.push(getOriginTag(url.hostname));

  return tags;
}

export function sortTagsDescending(tags: Tag[]) {
  return (tags as Required<Tag>[]).sort(isMoreFrequent);
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function isMoreFrequent(tag1: Required<Tag>, tag2: Required<Tag>) {
  return tag2.total - tag1.total;
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
// #endregion
