import {
  EndpointView,
  getAuthorTag,
  getFandomTag,
  getLanguageTag,
  getOriginTag,
  getRelationshipTag,
  LanguageCode,
  sortTagsDescending,
  Tag,
} from "@common";
import { z } from "@deps";

const CatalogItemSchema = z.custom<Tag>();

export default EndpointView.init({
  method: "get",
  path: "/tags-catalog",
  view: "catalog-tags",
  context: z.object({
    tags: z.array(CatalogItemSchema),
  }),
}).registerHandler(async function main(_req, res) {
  async function formatLanguageTag(code: LanguageCode) {
    const total = await res.app.fanfics.countDocuments({ language_code: code });

    return getLanguageTag(code, total);
  }
  const uniqueLanguages = await res.app.fanfics.distinct("language_code");
  const languageTags = await Promise.all(
    uniqueLanguages.map(formatLanguageTag),
  );

  async function formatSourceTag(source: string) {
    const total = await res.app.fanfics.countDocuments({ source });

    return getOriginTag(source, total);
  }
  const uniqueSources = await res.app.fanfics.distinct("source");
  const sourceTags = await Promise.all(uniqueSources.map(formatSourceTag));

  async function formatFandomTag(fandom: string) {
    const total = await res.app.fanfics.countDocuments({ fandom });

    return getFandomTag(fandom, total);
  }
  const uniqueFandoms = await res.app.fanfics.distinct("fandom");
  const fandomTags = await Promise.all(uniqueFandoms.map(formatFandomTag));

  async function formatRelationshipTag(relationship: string) {
    const total = await res.app.fanfics.countDocuments({ relationship });

    return getRelationshipTag(relationship, total);
  }
  const uniqueRelationships = await res.app.fanfics.distinct("relationship");
  const relationshipTags = await Promise.all(
    uniqueRelationships.map(formatRelationshipTag),
  );

  async function formatAuthorTag(authorName: string) {
    const total = await res.app.fanfics.countDocuments({
      "author.name": authorName,
    });

    return getAuthorTag(authorName, total);
  }
  const uniqueAuthors = await res.app.fanfics.distinct("author.name");
  const authorTags = await Promise.all(
    uniqueAuthors.map(formatAuthorTag),
  );

  return this.renderOk(res, {
    tags: sortTagsDescending([
      ...languageTags,
      ...sourceTags,
      ...fandomTags,
      ...relationshipTags,
      ...authorTags,
    ]),
  });
});
