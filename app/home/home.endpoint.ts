import { EndpointView, LiteFanfictionOutput } from "@common";
import { z } from "@deps";

const projection = {
  _id: 0,
  chapters: 0,
  kind: 0,
};

export default EndpointView.init({
  method: "get",
  path: "/",
  view: "home",
  context: z.object({
    recentlyAdded: z.custom<LiteFanfictionOutput[]>(),
    recentlyUpdated: z.custom<LiteFanfictionOutput[]>(),
  }),
}).registerHandler(async function main(_req, res) {
  const recentlyAdded = await res.app.fanfics
    .find(
      {},
      {
        projection,
        limit: 3,
      },
    )
    .sort({ created_at: -1 })
    .toArray();
  const recentlyUpdated = await res.app.fanfics
    .find(
      {
        $expr: { $gt: ["$updated_at", "$created_at"] },
      },
      {
        projection,
        limit: 3,
      },
    )
    .sort({ updated_at: -1 })
    .toArray();

  return this.renderOk(res, { recentlyAdded, recentlyUpdated });
});
