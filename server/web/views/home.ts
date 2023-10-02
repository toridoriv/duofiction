import { init } from "@endpoint";
import { Fanfictions, z } from "@deps";

const home = init({
  path: "/",
  view: "home",
  context: z.object({
    fanfictions: z.array(
      Fanfictions.Fanfiction.schema.extend({
        chapters: Fanfictions.Fanfiction.schema.shape.chapters.optional(),
      }),
    ),
  }),
});

export default home.registerHandler(
  async function mainHandler(this: typeof home, _req, res, _next) {
    const fanfictions = await res.app.db.fanfictions.find({}).project({
      _id: 0,
      chapters: 0,
    }).limit(5)
      .toArray() as Fanfictions.Fanfiction.output[];

    return this.renderOk(res, { fanfictions });
  },
);
