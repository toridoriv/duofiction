import { EndpointView, LiteFanfictionOutput } from "@common";
import { z } from "@deps";

const CatalogSummarySchema = z.custom<LiteFanfictionOutput>();

const limit = 3;
const projection = {
  _id: 0,
  chapters: 0,
  kind: 0,
};

const recentlyAddedOptions = {
  limit,
  projection,
  sort: { created_at: -1 as const },
};

const recentlyUpdatedQuery = {
  $expr: { $gt: ["$updated_at", "$created_at"] },
};

const recentlyUpdatedOptions = {
  limit,
  projection,
  sort: {
    updated_at: -1 as const,
  },
};

export default EndpointView.init({
  method: "get",
  path: "/",
  view: "catalog-summary",
  context: z.object({
    recentlyAdded: z.array(CatalogSummarySchema),
    recentlyUpdated: z.array(CatalogSummarySchema),
  }),
}).registerHandler(async function main(_req, res) {
  const recentlyAdded = await res.app.fanfics
    .find({}, recentlyAddedOptions)
    .toArray();
  const recentlyUpdated = await res.app.fanfics
    .find(recentlyUpdatedQuery, recentlyUpdatedOptions)
    .toArray();

  return this.renderOk(res, { recentlyAdded, recentlyUpdated });
});
