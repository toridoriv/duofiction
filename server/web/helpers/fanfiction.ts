import { Fanfictions, slug } from "@deps";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export function getTags(fanfiction: Fanfictions.Fanfiction) {
  const tags = [getFandomTag(fanfiction)];

  if (fanfiction.relationship.length > 0) {
    tags.push(getRelationshipTag(fanfiction));
  }

  return tags.concat(
    getLanguageTag(fanfiction),
    getOriginTag(fanfiction),
  );
}

export type Tag = {
  href: string;
  icon: string;
  tag: string;
  value: string;
};
// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function getFandomTag(fanfiction: Fanfictions.Fanfiction): Tag {
  return {
    tag: "fandom",
    value: fanfiction.fandom,
    icon: "scroll",
    href: `/fandoms/${slug(fanfiction.fandom)}`,
  };
}

function getRelationshipTag(fanfiction: Fanfictions.Fanfiction): Tag {
  return {
    tag: "relationship",
    value: fanfiction.relationship.join("/"),
    icon: "user-group",
    href: `/relationships/${slug(fanfiction.relationship.join(" and "))}`,
  };
}

function getLanguageTag(fanfiction: Fanfictions.Fanfiction): Tag {
  return {
    tag: "language",
    value: fanfiction.language,
    icon: "globe",
    href: `/languages/${fanfiction.language_code}`,
  };
}

function getOriginTag(fanfiction: Fanfictions.Fanfiction): Tag {
  const host = new URL(fanfiction.origin_url).hostname;

  return {
    tag: "origin",
    value: host,
    icon: "link",
    href: `/origin/${slug(host)}`,
  };
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
// #endregion
