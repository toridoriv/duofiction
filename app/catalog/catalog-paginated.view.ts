import { EndpointView, LiteFanfictionOutput } from "@common";
import { z } from "@deps";

const CatalogItemSchema = z.custom<LiteFanfictionOutput>();
const CatalogPageSchema = z.object({
  href: z.string(),
  isActive: z.boolean().default(false),
  index: z.number().int(),
});

const options = {
  projection: {
    _id: 0,
    chapters: 0,
    kind: 0,
  },
  limit: 5,
  sort: { created_at: -1 as const },
};

export default EndpointView.init({
  method: "get",
  path: "/fanfiction-catalog/pages/:page",
  view: "catalog-paginated",
  payload: {
    params: z.object({
      page: z.coerce.number().int(),
    }),
  },
  context: z.object({
    fanfictions: z.array(CatalogItemSchema),
    pages: z.array(CatalogPageSchema),
    currentPage: z.number().int(),
  }),
}).registerHandler(async function main(req, res) {
  const total = await res.app.fanfics.countDocuments();
  const totalPages = Math.ceil(total / options.limit);
  const currentPage = req.params.page;
  const pages = Array.from(
    { length: totalPages },
    (_, index) =>
      CatalogPageSchema.parse({
        href: this.path.replace(":page", String(index + 1)),
        isActive: currentPage === index + 1,
        index: index + 1,
      }),
  );
  const skip = currentPage === 1
    ? 0
    : currentPage * options.limit - options.limit;
  const fanfictions = await res.app.fanfics
    .find({}, options)
    .skip(skip)
    .toArray();

  return this.renderOk(res, { fanfictions, pages, currentPage });
});
