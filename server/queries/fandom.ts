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
export function getUniqueFandoms(collection: FanfictionsCollection) {
  return collection.distinct("fandom");
}

export function getFandomCount(
  collection: FanfictionsCollection,
  fandom: string,
) {
  return collection.countDocuments({ fandom });
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
