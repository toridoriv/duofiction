import { z } from "@utils/deps.ts";

export enum SortOrder {
  ASCENDING = 1,
  DESCENDING = -1,
}

export const SortOrderSchema = z.nativeEnum(SortOrder);

export const FanfictionAttributesSortQuery = z.object({
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
});
