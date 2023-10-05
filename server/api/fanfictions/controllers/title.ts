import * as endpoint from "@endpoint";
import {
  Fanfictions,
  LanguageCodeSchema,
  LanguageNameByCode,
  LanguageNameSchema,
  Status,
  z,
} from "@deps";
import { ParamsWithId } from "@utils";
import { FanfictionQueryOptions } from "@database";
import { NotFoundError } from "@errors";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
const projection = getTitleProjection();
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export const retrieve = endpoint
  .init({
    resource: "fanfiction",
    method: "get",
    path: "/:id/title",
    payload: {
      params: ParamsWithId,
    },
    data: Fanfictions.Localization.schema,
  })
  .registerHandler(async function main(req, res) {
    const fanfiction = await res.app.fanficRepository.retrieve(req.params.id, {
      projection,
    });

    if (fanfiction === null) {
      const error = new NotFoundError(
        `Fanfiction with id ${req.params.id} not found :(`,
      );
      const response = this.getResponse(Status.NotFound).setErrors(error);

      return res.status(response.status).json(response);
    }

    const response = this.getResponse(Status.OK).setData(fanfiction.title);

    return res.status(response.status).json(response);
  });

export const update = endpoint
  .init({
    method: "patch",
    resource: "fanfiction",
    path: "/:id/title/translations/:language_code",
    payload: {
      params: ParamsWithId.extend({
        language_code: LanguageCodeSchema,
      }),
      body: Fanfictions.Text.schema.extend({
        language_code: LanguageCodeSchema.optional(),
        language: LanguageNameSchema.optional(),
      }),
    },
    data: z.boolean(),
  })
  .registerHandler(async function main(req, res) {
    const result = await res.app.fanficRepository.update(req.params.id, {
      $push: {
        "title.translations": Fanfictions.Text.create({
          raw: req.body.raw,
          rich: req.body.rich,
          language_code: req.params.language_code,
          language: LanguageNameByCode[req.params.language_code],
        }),
      },
    });

    if (!result.modifiedCount) {
      const error = new NotFoundError(
        `Fanfiction with id ${req.params.id} not found :(`,
      );

      const response = this.getResponse(Status.NotFound).setErrors(error);

      return res.status(response.status).json(response);
    }

    return res.status(Status.NoContent).end();
  });

// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function getTitleProjection(): FanfictionQueryOptions["projection"] {
  const keys = (
    Object.keys(
      Fanfictions.Fanfiction.schema.shape,
    ) as (keyof Fanfictions.Fanfiction.output)[]
  ).filter(isNotTitle);

  return keys.reduce(
    (acc, curr) => {
      acc[curr] = 0;

      return acc;
    },
    {} as FanfictionQueryOptions["projection"],
  );
}

function isNotTitle(value: string) {
  return value !== "title";
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
// #endregion
