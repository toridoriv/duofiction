import * as endpoint from "@endpoint";
import { BSON, Fanfictions, Status } from "@deps";

const create = endpoint.init({
  resource: "fanfiction",
  method: "post",
  payload: {
    body: Fanfictions.Fanfiction.schema.transform((x) => {
      Object.assign(x, { _id: new BSON.UUID(x.id) });
      return x;
    }),
  },
  data: Fanfictions.Fanfiction.schema,
});

export default create.registerHandler(
  async function mainHandler(this: typeof create, req, res, _next) {
    await res.app.db.fanfictions.insertOne(req.body);
    const response = this.getResponse(Status.OK).setData(req.body);

    Object.defineProperty(response.data, "_id", {
      enumerable: false,
    });

    return res.status(response.status).json(response);
  },
);
