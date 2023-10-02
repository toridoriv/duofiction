import { init } from "@endpoint";
import { Fanfictions, z } from "@deps";
import { fetchFromApi } from "@utils";

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
    const response = await fetchFromApi<Fanfictions.Fanfiction[]>(
      "/api/fanfictions",
    );
    const fanfictions = response.data;

    return this.renderOk(res, { fanfictions: fanfictions || [] });
  },
);
