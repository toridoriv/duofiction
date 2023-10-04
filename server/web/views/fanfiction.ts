import * as endpoint from "@endpoint";
import { Fanfictions, z } from "@deps";
import { getFanfictionById } from "@queries";

const fanfiction = endpoint.init({
  path: "/fanfictions/:id",
  view: "fanfiction",
  payload: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  context: z.object({
    subtitle: z.string(),
    fanfiction: z.custom<Fanfictions.Fanfiction.output>(),
  }),
});

export default fanfiction.registerHandler(
  async function mainHandler(this: typeof fanfiction, req, res, next) {
    const retrieved = await getFanfictionById(
      res.app.db.fanfictions,
      req.params.id,
    );

    if (retrieved === null) {
      return next();
    }

    return this.renderOk(res, {
      fanfiction: retrieved,
      subtitle: retrieved.title.original.raw,
    });
  },
);
