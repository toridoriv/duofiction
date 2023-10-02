import * as endpoint from "@endpoint";
import { BSON, Fanfictions, Status, z } from "@deps";
import { NotFoundError } from "@errors";

const retrieve = endpoint.init({
  resource: "fanfiction",
  method: "get",
  payload: { params: z.object({ id: z.string().uuid() }) },
  data: Fanfictions.Fanfiction.schema,
  path: "/:id",
});

export default retrieve.registerHandler(async function mainHandler(
  this: typeof retrieve,
  req,
  res,
  _next,
) {
  const document = await res.app.db.fanfictions.findOne(
    {
      _id: new BSON.UUID(req.params.id) as unknown as BSON.ObjectId,
    },
    { projection: { _id: 0 } },
  );

  if (document === null) {
    const error = new NotFoundError(
      `Fanfiction with id ${req.params.id} not found :(`,
    );
    const response = this.getResponse(Status.NotFound).setErrors(error);

    return res.status(response.status).json(response);
  }

  const response = this.getResponse(Status.OK).setData(document);

  return res.status(response.status).json(response);
});
