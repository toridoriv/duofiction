import { Handlers } from "$fresh/server.ts";
import { FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";
import { client, SortOrder, Status, z } from "@utils/mod.ts";

const ListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(5),
  skip: z.coerce.number().int().min(0).default(0),
  sort: z.enum(["created_at", "updated_at"]).default("created_at"),
  order: z.enum(["ASCENDING", "DESCENDING"]).default("ASCENDING"),
});

export const handler: Handlers<FanfictionAttributesOutput | null> = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const query = ListQuerySchema.parse(
      Object.fromEntries(url.searchParams.entries()),
    );
    const dbQuery = query.sort === "updated_at"
      ? { $expr: { $gt: ["$updated_at", "$created_at"] } }
      : {};

    const fanfictions = await client.fanfictions.find(dbQuery, {
      projection: {
        _id: 0,
        created_at: 0,
        updated_at: 0,
        kind: 0,
        chapters: 0,
      },
      limit: query.limit,
      skip: query.skip,
      sort: {
        [query.sort]: SortOrder[query.order],
      },
    })
      .toArray();

    return new Response(JSON.stringify(fanfictions), {
      status: Status.OK,
      headers: new Headers([["content-type", "application/json"]]),
    });
  },
};
