import * as endpoint from "@endpoint";
import { Fanfictions, UpdateResult, z } from "@deps";
import { Status } from "@deps";
import {
  addChapterParagraphTranslations,
  addChapterTitleTranslations,
} from "@queries";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const sharedEndpointOptions = {
  resource: "fanfiction",
  method: "patch" as const,
  payload: {
    params: z.object({
      id: z.string().uuid(),
      chapterIndex: z.coerce.number().int(),
    }),
    body: z.array(Fanfictions.Text.schema).min(1),
  },
  data: z.custom<UpdateResult>(),
};

const $chapterTitleTranslations = endpoint.init({
  ...sharedEndpointOptions,
  path: "/:id/chapters/:chapterIndex/title/translations",
  payload: {
    params: sharedEndpointOptions.payload.params,
    body: sharedEndpointOptions.payload.body,
  },
  data: z.custom<UpdateResult>(),
});

const $chapterParagraphTranslations = endpoint.init({
  ...sharedEndpointOptions,
  path: "/:id/chapters/:chapterIndex/paragraphs/:paragraphIndex/translations",
  payload: {
    params: sharedEndpointOptions.payload.params.extend({
      paragraphIndex: z.coerce.number().int(),
    }),
    body: sharedEndpointOptions.payload.body,
  },
  data: z.custom<UpdateResult>(),
});
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export const chapterTitleTranslations = $chapterTitleTranslations
  .registerHandler(async function mainHandler(
    this: typeof $chapterTitleTranslations,
    req,
    res,
  ) {
    const collection = res.app.db.fanfictions;
    const { id, chapterIndex } = req.params;
    const translations = req.body;
    const result = await addChapterTitleTranslations(collection, id, {
      chapterIndex,
      translations,
    });
    const response = this.getResponse(Status.OK).setData(result);

    return res.status(response.status).json(response);
  });

export const chapterParagraphTranslations = $chapterParagraphTranslations
  .registerHandler(async function mainHandler(
    this: typeof $chapterParagraphTranslations,
    req,
    res,
  ) {
    const collection = res.app.db.fanfictions;
    const { id, chapterIndex, paragraphIndex } = req.params;
    const translations = req.body;
    const result = await addChapterParagraphTranslations(collection, id, {
      chapterIndex,
      translations,
      paragraphIndex,
    });
    const response = this.getResponse(Status.OK).setData(result);

    return res.status(response.status).json(response);
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
