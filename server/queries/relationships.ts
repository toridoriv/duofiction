import { FanfictionsCollection } from "./typings.ts";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export function getUniqueRelationships(collection: FanfictionsCollection) {
  return collection.distinct("relationship");
}

export function getRelationshipCount(
  collection: FanfictionsCollection,
  relationship: string,
) {
  return collection.countDocuments({ relationship });
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
