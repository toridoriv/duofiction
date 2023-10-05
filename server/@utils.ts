import { BSON, Fanfictions, z } from "@deps";
import type { FanfictionDocument } from "./database.ts";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export const FanfictionInputSchema = Fanfictions.Fanfiction.schema.transform(
  toDocument,
);

export type FanfictionInput = z.input<typeof FanfictionInputSchema>;

export const FanfictionOutputSchema = Fanfictions.Fanfiction.schema.extend({
  _id: z.custom<BSON.UUID>(),
}).transform(fromDocument);

export const UnsafeFanfictionOutputSchema = z.custom<FanfictionDocument>()
  .transform(Fanfictions.Fanfiction.unsafeParse);

export function toUuid(id: string) {
  return new BSON.UUID(id);
}

export const ParamsWithId = z.object({
  id: z.string().uuid(),
});
// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function toDocument<T extends Fanfictions.Fanfiction.output>(
  data: T,
) {
  Object.defineProperty(data, "_id", {
    value: toUuid(data.id),
    enumerable: true,
  });

  return data as unknown as FanfictionDocument;
}

function fromDocument<T extends FanfictionDocument>(
  document: T,
): Fanfictions.Fanfiction {
  return Fanfictions.Fanfiction.parse(document);
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
// #endregion
