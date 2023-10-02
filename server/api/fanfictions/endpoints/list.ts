import * as endpoint from "@endpoint";
import { Fanfictions, Status, z } from "@deps";

enum Projection {
  Exclude = 0,
  Include = 1,
}

const list = endpoint.init({
  resource: "fanfictions",
  method: "get",
  payload: {
    query: z.object({
      limit: z.coerce.number().int().min(1).max(30).default(5),
      skip: z.coerce.number().int().min(0).default(0),
      exclude: z
        .string()
        .default("paragraphs")
        .transform(splitQuery).transform(
          toExcludeProjection,
        ),
      include: z.literal("paragraphs").transform(splitQuery).optional(),
    }),
  },
  data: z.array(Fanfictions.Fanfiction.schema),
});

export default list.registerHandler(async function mainHandler(
  this: typeof list,
  req,
  res,
  _next,
) {
  const { query } = req;
  const projection = { ...query.exclude };

  if (query.include) {
    query.include.forEach((k) => {
      delete projection[k];
    });
  }

  const documents = await res.app.db.fanfictions
    .find({})
    .project<Fanfictions.Fanfiction>({ _id: 0, ...projection })
    .limit(query.limit)
    .skip(query.skip)
    .toArray();

  const response = this.getResponse(Status.OK).setData(documents);

  return res.status(response.status).json(response);
});

function toProjection(kind: Projection, keys: string[]) {
  return keys.reduce((acc, curr) => {
    acc[curr] = kind;

    return acc;
  }, {} as Record<string, number>);
}

function toExcludeProjection(keys: string[]) {
  return toProjection(Projection.Exclude, keys);
}

function splitQuery(value: string) {
  return value === "" ? [] : value.split(",");
}
