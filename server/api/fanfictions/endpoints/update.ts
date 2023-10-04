import * as endpoint from "@endpoint";
import { Fanfictions, z } from "@deps";
import { addTitleTranslation } from "@queries";
import { Status } from "@deps";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const update = endpoint.init({
  path: "/:id",
  resource: "fanfiction",
  method: "patch",
  payload: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      title: z
        .object({
          translations: z.array(Fanfictions.Text.schema).min(1),
        })
        .optional(),
    }),
  },
  data: z.boolean(),
});
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export default update.registerHandler(async function mainHandler(
  this: typeof update,
  req,
  res,
  next,
) {
  const collection = res.app.db.fanfictions;
  const id = req.params.id;
  const update = req.body;

  if (update.title) {
    const result = await addTitleTranslation(
      collection,
      id,
      update.title.translations,
    );
    const wasUpdated = result.modifiedCount > 0;
    const response = this.getResponse(
      wasUpdated ? Status.OK : Status.NotModified,
    ).setData(wasUpdated);

    return res.status(response.status).json(response);
  }

  return next();
});
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
