import * as endpoint from "@endpoint";
import { Fanfictions, UpdateResult, z } from "@deps";
import { Status } from "@deps";
import { addTitleTranslations } from "@queries";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const $titleTranslations = endpoint.init({
  path: "/:id/title/translations",
  resource: "fanfiction",
  method: "patch",
  payload: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.array(Fanfictions.Text.schema).min(1),
  },
  data: z.custom<UpdateResult>(),
});
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region

export const titleTranslations = $titleTranslations.registerHandler(
  async function mainHandler(this: typeof $titleTranslations, req, res) {
    const collection = res.app.db.fanfictions;
    const id = req.params.id;
    const translations = req.body;
    const result = await addTitleTranslations(collection, id, translations);
    const response = this.getResponse(Status.OK).setData(result);

    return res.status(response.status).json(response);
  },
);

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
