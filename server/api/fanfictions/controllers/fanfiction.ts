import * as endpoint from "@endpoint";
import {
  FanfictionInputSchema,
  FanfictionOutputSchema,
  ParamsWithId,
} from "@utils";
import { Status, z } from "@deps";
import { NotFoundError } from "@errors";

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export const create = endpoint
  .init({
    resource: "fanfiction",
    method: "post",
    payload: {
      body: FanfictionInputSchema,
    },
    data: FanfictionOutputSchema,
  })
  .registerHandler(async function main(req, res) {
    const fanfiction = await res.app.fanficRepository.create(req.body);
    const response = this.getResponse(Status.Created).setData(fanfiction);

    return res.status(response.status).json(response);
  });

export const retrieve = endpoint
  .init({
    resource: "fanfiction",
    method: "get",
    path: "/:id",
    payload: {
      params: ParamsWithId,
    },
    data: FanfictionOutputSchema,
  })
  .registerHandler(async function main(req, res) {
    const fanfiction = await res.app.fanficRepository.retrieve(req.params.id);

    if (fanfiction === null) {
      const error = new NotFoundError(
        `Fanfiction with id ${req.params.id} not found :(`,
      );
      const response = this.getResponse(Status.NotFound).setErrors(error);

      return res.status(response.status).json(response);
    }

    const response = this.getResponse(Status.OK).setData(fanfiction);

    return res.status(response.status).json(response);
  });

export const destroy = endpoint
  .init({
    resource: "fanfiction",
    method: "delete",
    path: "/:id",
    payload: {
      params: ParamsWithId,
    },
    data: z.boolean(),
  })
  .registerHandler(async function main(req, res) {
    const result = await res.app.fanficRepository.delete(req.params.id);

    if (!result.deletedCount) {
      const error = new NotFoundError(
        `Fanfiction with id ${req.params.id} not found :(`,
      );

      const response = this.getResponse(Status.NotFound).setErrors(error);

      return res.status(response.status).json(response);
    }

    return res.status(Status.NoContent).end();
  });

export const list = endpoint
  .init({
    resource: "fanfictions",
    method: "get",
    payload: {
      query: z.object({
        limit: z.coerce.number().int().min(1).max(30).default(5),
        skip: z.coerce.number().int().min(0).default(0),
      }),
    },
    data: z.array(FanfictionOutputSchema),
  })
  .registerHandler(async function main(req, res) {
    const documents = await res.app.fanficRepository.list(
      {},
      {
        ...req.query,
        projection: {
          chapters: 0,
        },
      },
    );

    const response = this.getResponse(Status.OK).setData(documents);

    return res.status(response.status).json(response);
  });

// #endregion
