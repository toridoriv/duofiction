import { LOCATION } from "@constants";
import { UnknownFetchError } from "@errors";

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
    throw new UnknownFetchError(
      `There was a problem making a request to ${LOCATION + path}`,
      {
        status: String(response.status),
        statusText: response.statusText,
        body: await response.text(),
      },
    );
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
