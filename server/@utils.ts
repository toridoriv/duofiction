import { LOCATION } from "@constants";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export async function fetchFromApi<T>(
  path: `/${string}`,
  config?: RequestInit,
): Promise<GenericApiResponse<T>> {
  const response = await fetch(LOCATION + path, config);

  if (!response.ok) {
    throw new Error("idk");
  }

  return response.json();
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
