import { init } from "@endpoint";
import { Languages, z } from "@deps";

const createFanfiction = init({
  path: "/fanfictions/create",
  view: "create-fanfiction",
  context: z.object({
    subtitle: z.string().default("New Fanfiction"),
    languages: z.array(z.tuple([z.string(), z.string()])).default(Languages),
  }),
});

export default createFanfiction.registerHandler(
  function mainHandler(this: typeof createFanfiction, _req, res, _next) {
    // const response = await fetchFromApi<Fanfictions.Fanfiction[]>(
    //   "/api/fanfictions",
    // );
    // const fanfictions = response.data;

    return this.renderOk(res, {});
  },
);
