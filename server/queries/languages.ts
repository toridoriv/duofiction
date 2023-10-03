import type { LanguageCode } from "@deps";
import type { FanfictionsCollection } from "./typings.ts";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export function getUniqueLanguageCodes(collection: FanfictionsCollection) {
  return collection.distinct("language_code");
}

export function getLanguageCodeCount(
  collection: FanfictionsCollection,
  code: LanguageCode,
) {
  return collection.countDocuments({ language_code: code });
}

// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region

// #endregion
