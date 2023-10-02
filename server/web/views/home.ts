import { init } from "@endpoint";
import { Fanfictions, z } from "@deps";

const home = init({
  path: "/",
  view: "home",
  context: z.object({
    fanfictions: z.array(
      Fanfictions.Fanfiction.schema.transform(Fanfictions.Fanfiction.parse),
    ),
  }),
});

export default home.registerHandler(
  async function mainHandler(this: typeof home, _req, res, _next) {
    const fanfictions = await res.app.db.fanfictions.find({}).limit(5)
      .toArray();

    return this.renderOk(res, { fanfictions });
  },
);
