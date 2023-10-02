import { init } from "@endpoint";
import { Fanfictions, z } from "@deps";
import { fetchFromApi } from "@utils";

const tags = init({
  path: "/tags",
  view: "tags",
  context: z.object({
    subtitle: z.string().default("Tags"),
  }),
});

export default tags.registerHandler(
  function mainHandler(this: typeof tags, _req, res, _next) {
    // const response = await fetchFromApi<Fanfictions.Fanfiction[]>(
    //   "/api/fanfictions",
    // );
    // const fanfictions = response.data;

    return this.renderOk(res, {});
  },
);
