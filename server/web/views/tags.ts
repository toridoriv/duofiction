import { init } from "@endpoint";
import { z } from "@deps";
import {
  getFandomCount,
  getLanguageCodeCount,
  getRelationshipCount,
  getSourceCount,
  getUniqueFandoms,
  getUniqueLanguageCodes,
  getUniqueRelationships,
  getUniqueSources,
} from "@queries";
import {
  getFandomTag,
  getLanguageTag,
  getOriginTag,
  getRelationshipTag,
  sortTagsDescending,
  type Tag,
} from "@helpers";

const tags = init({
  path: "/tags",
  view: "tags",
  context: z.object({
    subtitle: z.string().default("Tags"),
    tags: z.custom<Tag[]>(),
  }),
});

export default tags.registerHandler(async function mainHandler(
  this: typeof tags,
  _req,
  res,
  _next,
) {
  const collection = res.app.db.fanfictions;
  const tags: Tag[] = [];

  const codes = await getUniqueLanguageCodes(collection);

  for (let i = 0; i < codes.length; i++) {
    const tag = getLanguageTag(
      codes[i],
      await getLanguageCodeCount(collection, codes[i]),
    );

    tags.push(tag);
  }

  const sources = await getUniqueSources(collection);

  for (let i = 0; i < sources.length; i++) {
    const tag = getOriginTag(
      sources[i],
      await getSourceCount(collection, sources[i]),
    );

    tags.push(tag);
  }

  const relationships = await getUniqueRelationships(collection);

  for (let i = 0; i < relationships.length; i++) {
    const tag = getRelationshipTag(
      relationships[i],
      await getRelationshipCount(collection, relationships[i]),
    );

    tags.push(tag);
  }

  const fandoms = await getUniqueFandoms(collection);

  for (let i = 0; i < fandoms.length; i++) {
    const tag = getFandomTag(
      fandoms[i],
      await getFandomCount(collection, fandoms[i]),
    );

    tags.push(tag);
  }

  return this.renderOk(res, { tags: sortTagsDescending(tags) });
});
