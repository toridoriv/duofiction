import {
  ApiResponse,
  ApiResponsePaginatedMetadata,
  client,
  getJsonHeaders,
  SortOrder,
  Status,
  z,
} from "@utils/mod.ts";
import { FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";

const ListQuerySchema = z.object({
  size: z.coerce.number().int().min(1).max(20).default(5),
  sort: z.enum(["created_at", "updated_at"]).default("created_at"),
  order: z.enum(["ASCENDING", "DESCENDING"]).default("ASCENDING"),
  offset: z.coerce.number().int().min(0).default(0),
});

export class FanfictionAttributesResponse extends ApiResponse<
  FanfictionAttributesOutput[],
  ApiResponsePaginatedMetadata
> {}

export type ListAttributesHandlerContext = {
  params: z.input<typeof ListQuerySchema>;
};

export const handler = {
  async GET(_req: Request | null, ctx: ListAttributesHandlerContext) {
    const { size, sort, order, offset } = ListQuerySchema.parse(ctx.params);
    const query = sort === "updated_at"
      ? { $expr: { $gt: ["$updated_at", "$created_at"] } }
      : {};
    const total = await client.fanfictions.countDocuments({});

    const fanfictions = await client.fanfictions
      .find(query, {
        projection: {
          _id: 0,
          created_at: 0,
          updated_at: 0,
          kind: 0,
          chapters: 0,
        },
        limit: size,
        skip: offset,
        sort: {
          [sort]: SortOrder[order],
        },
      })
      .toArray();

    return new FanfictionAttributesResponse(fanfictions, {
      headers: getJsonHeaders(),
      status: Status.OK,
    }).setMetadata({ total, size, offset });
  },
};
